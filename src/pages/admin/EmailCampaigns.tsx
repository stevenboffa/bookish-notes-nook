
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function EmailCampaigns() {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [editedTemplate, setEditedTemplate] = useState<any>(null);

  const { data: templates, isLoading: loadingTemplates } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: scheduledEmails, isLoading: loadingEmails } = useQuery({
    queryKey: ['scheduled-emails'],
    queryFn: async () => {
      // First, fetch scheduled emails
      const { data: emails, error: emailsError } = await supabase
        .from('scheduled_emails')
        .select(`
          *,
          email_templates (name, subject)
        `)
        .order('scheduled_for', { ascending: false });

      if (emailsError) throw emailsError;
      
      // If we have emails, fetch user emails separately and merge them
      if (emails && emails.length > 0) {
        const userIds = emails.map(email => email.user_id);
        
        const { data: userProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds);
          
        if (profilesError) throw profilesError;
        
        // Create a map of user_id to email
        const profileMap = new Map();
        userProfiles?.forEach(profile => {
          profileMap.set(profile.id, profile.email);
        });
        
        // Merge the profile emails with the scheduled emails data
        const emailsWithUserData = emails.map(email => ({
          ...email,
          user_email: profileMap.get(email.user_id) || 'Unknown email'
        }));
        
        return emailsWithUserData;
      }
      
      return emails || [];
    },
  });

  const handleSaveTemplate = async () => {
    if (!editedTemplate) return;

    try {
      const { error } = await supabase
        .from('email_templates')
        .update({
          subject: editedTemplate.subject,
          content: editedTemplate.content
        })
        .eq('id', editedTemplate.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Email template updated successfully",
      });
      
      setSelectedTemplate(null);
      setEditedTemplate(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Email Campaign Management</h1>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Emails</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Template List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Templates</h2>
              {loadingTemplates ? (
                <p>Loading templates...</p>
              ) : (
                <div className="space-y-2">
                  {templates?.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 border rounded-lg cursor-pointer hover:bg-accent"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setEditedTemplate(template);
                      }}
                    >
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.subject}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Template Editor */}
            {selectedTemplate && editedTemplate && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Edit Template</h2>
                <div className="space-y-4">
                  <Input
                    value={editedTemplate.subject}
                    onChange={(e) => setEditedTemplate({
                      ...editedTemplate,
                      subject: e.target.value
                    })}
                    placeholder="Email subject"
                  />
                  <Textarea
                    value={editedTemplate.content}
                    onChange={(e) => setEditedTemplate({
                      ...editedTemplate,
                      content: e.target.value
                    })}
                    placeholder="Email content"
                    rows={10}
                  />
                  <Button onClick={handleSaveTemplate}>Save Template</Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Scheduled Emails</h2>
            {loadingEmails ? (
              <p>Loading scheduled emails...</p>
            ) : (
              <div className="space-y-4">
                {scheduledEmails?.map((email) => (
                  <div key={email.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{email.email_templates?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          To: {email.user_email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Scheduled for: {new Date(email.scheduled_for).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        email.status === 'sent' ? 'bg-green-100 text-green-800' :
                        email.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {email.status}
                      </span>
                    </div>
                    {email.error_message && (
                      <p className="mt-2 text-sm text-red-600">{email.error_message}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
