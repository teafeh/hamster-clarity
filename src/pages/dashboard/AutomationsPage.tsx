import { useAutomationSettings, AutomationBooleanKey } from '@/hooks/useAutomationSettings'
import { useEmailTemplates } from '@/hooks/useEmailTemplates'
import { useEmailSettings } from '@/hooks/useEmailSettings'
import { emailSenderService } from '@/services/automation/email/emailSenderService'
import { useEffect, useState } from 'react'


type WorkflowSettingKey = AutomationBooleanKey



const WORKFLOWS = [
    {
        id: 'welcome_customer_enabled' as WorkflowSettingKey,
        title: 'Welcome New Customer',
        description:
            'Send a friendly introduction email when a new customer profile is created.',
    },
    {
        id: 'appointment_reminder_enabled' as WorkflowSettingKey,
        title: 'Appointment Reminder',
        description:
            'Send a reminder before an upcoming appointment.',
    },
    {
        id: 'follow_up_enabled' as WorkflowSettingKey,
        title: 'Follow-up After Visit',
        description:
            'Ask customers for feedback after an appointment.',
    },
    {
        id: 'win_back_enabled' as WorkflowSettingKey,
        title: 'Win Back Inactive Customers',
        description:
            'Reach out to customers who have not booked recently.',
    },
]

export default function AutomationsPage() {

    const {
        settings,
        loading,
        updateSetting,
    } = useAutomationSettings()

    const showSkeleton =
        loading || !settings

    const [savingEmail, setSavingEmail] = useState(false)
    const [emailSaved, setEmailSaved] = useState(false)

    const {
        templates,
        loading: _templatesLoading,
        updateTemplate,
    } = useEmailTemplates()

    const [selectedTemplateId, setSelectedTemplateId] =
        useState<string | null>(null)

    const [templateSubject, setTemplateSubject] =
        useState('')

    const [templateBody, setTemplateBody] =
        useState('')

    const [savingTemplate, setSavingTemplate] =
        useState(false)

    const [templateSaved, setTemplateSaved] =
        useState(false)

    const [sendingTestEmail, setSendingTestEmail] =
        useState(false)

    const sendTestEmail = async () => {
        try {
            setSendingTestEmail(true)

            await emailSenderService.sendEmail({
                to: replyToEmail,
                subject: templateSubject,
                html: templateBody,
            })
        } finally {
            setSendingTestEmail(false)
        }
    }

    useEffect(() => {
        if (!templates.length) return

        const firstTemplate = templates[0]

        setSelectedTemplateId(firstTemplate.id)
        setTemplateSubject(firstTemplate.subject)
        setTemplateBody(firstTemplate.body)
    }, [templates])

    const {
        settings: emailSettings,
        updateSettings: updateEmailSettings,
    } = useEmailSettings()

    const [senderName, setSenderName] =
        useState('')

    const [replyToEmail, setReplyToEmail] =
        useState('')


    useEffect(() => {
        if (!emailSettings) return

        setSenderName(
            emailSettings.sender_name ?? ''
        )

        setReplyToEmail(
            emailSettings.reply_to_email ?? ''
        )
    }, [emailSettings])

    const saveEmailSettings = async () => {
        try {
            setSavingEmail(true)
            setEmailSaved(false)

            await updateEmailSettings({
                sender_name: senderName,
                reply_to_email: replyToEmail,
            })

            setEmailSaved(true)

            setTimeout(() => {
                setEmailSaved(false)
            }, 2500)
        } catch (err) {
            console.error(err)
        } finally {
            setSavingEmail(false)
        }
    }

    const handleTemplateSelect = (
        templateId: string
    ) => {
        const template =
            templates.find(
                (t) => t.id === templateId
            )

        if (!template) return

        setSelectedTemplateId(template.id)
        setTemplateSubject(template.subject)
        setTemplateBody(template.body)
    }

    const saveTemplate = async () => {
        if (!selectedTemplateId) return

        try {
            setSavingTemplate(true)
            setTemplateSaved(false)

            await updateTemplate(
                selectedTemplateId,
                templateSubject,
                templateBody
            )

            setTemplateSaved(true)

            setTimeout(() => {
                setTemplateSaved(false)
            }, 2500)
        } catch (err) {
            console.error(err)
        } finally {
            setSavingTemplate(false)
        }
    }


    return (
        <div
            className="px-6 py-8 max-w-5xl mx-auto"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            {/* Header */}
            {showSkeleton ? (
                <div className="mb-8 animate-pulse">
                    <div className="h-3 w-28 bg-gray-200 rounded mb-3" />
                    <div className="h-8 w-48 bg-gray-200 rounded mb-3" />
                    <div className="h-4 w-72 bg-gray-200 rounded" />
                </div>
            ) : (
                <div className="mb-8">
                    <p
                        className="text-xs font-semibold tracking-widest uppercase mb-2"
                        style={{ color: '#E07B39' }}
                    >
                        manage
                    </p>

                    <h1
                        className="text-3xl font-semibold mb-2"
                        style={{
                            fontFamily: "'Fraunces', serif",
                            color: '#111111',
                        }}
                    >
                        Automations
                    </h1>

                    <p
                        className="text-sm"
                        style={{ color: '#6B7280' }}
                    >
                        Automate customer communication and follow-ups.
                    </p>
                </div>
            )}

            {/* Flow Assistant */}
            {showSkeleton ? (
                <div
                    className="
      border
      rounded-2xl
      p-5
      mb-6
      animate-pulse
    "
                    style={{
                        borderColor: '#E5E7EB',
                        backgroundColor: '#FFFFFF',
                    }}
                >
                    <div className="flex justify-between">
                        <div className="space-y-3">
                            <div className="h-5 w-40 bg-gray-200 rounded" />
                            <div className="h-4 w-72 bg-gray-200 rounded" />
                            <div className="h-3 w-32 bg-gray-200 rounded" />
                        </div>

                        <div className="h-10 w-16 bg-gray-200 rounded-full" />
                    </div>
                </div>
            ) : (
                <div
                    className="border rounded-2xl p-5 mb-6"
                    style={{
                        borderColor: '#E5E7EB',
                        backgroundColor: '#FFFFFF',
                    }}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2
                                className="text-lg font-semibold mb-1"
                                style={{
                                    fontFamily: "'Fraunces', serif",
                                }}
                            >
                                Flow Assistant
                            </h2>

                            <p
                                className="text-sm"
                                style={{ color: '#6B7280' }}
                            >
                                Allow Flow by Hamster to recommend and help
                                configure automation workflows for your business.
                            </p>

                            <p
                                className="text-xs mt-2"
                                style={{
                                    color: settings?.flow_assistant_enabled
                                        ? '#16A34A'
                                        : '#6B7280',
                                }}
                            >
                                {settings?.flow_assistant_enabled
                                    ? 'Flow Assistant is enabled'
                                    : 'Flow Assistant is disabled'}
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                updateSetting(
                                    'flow_assistant_enabled',
                                    !settings?.flow_assistant_enabled
                                )
                            }
                            className="
          px-4
          py-2
          rounded-full
          text-sm
          font-medium
          transition-colors
        "
                            style={{
                                backgroundColor:
                                    settings?.flow_assistant_enabled
                                        ? '#E07B39'
                                        : '#F3F4F6',

                                color:
                                    settings?.flow_assistant_enabled
                                        ? '#FFFFFF'
                                        : '#111111',
                            }}
                        >
                            {settings?.flow_assistant_enabled
                                ? 'ON'
                                : 'OFF'}
                        </button>
                    </div>
                </div>
            )}

            {/* Recommended Workflows */}
            {showSkeleton ? (
                <div className="mb-4 animate-pulse">
                    <div className="h-6 w-56 bg-gray-200 rounded" />
                </div>
            ) : (
                <div className="mb-4">
                    <h2
                        className="text-lg font-semibold"
                        style={{
                            fontFamily: "'Fraunces', serif",
                        }}
                    >
                        Recommended Workflows
                    </h2>
                </div>
            )}

            <div className="grid gap-4">
                {showSkeleton ? (
                    <>
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="
            h-28
            rounded-2xl
            border
            animate-pulse
          "
                                style={{
                                    backgroundColor: '#F3F4F6',
                                    borderColor: '#E5E7EB',
                                }}
                            />
                        ))}
                    </>
                ) : (
                    WORKFLOWS.map((workflow) => (
                        <div
                            key={workflow.id}
                            className="border rounded-2xl p-5"
                            style={{
                                borderColor: '#E5E7EB',
                                backgroundColor: '#FFFFFF',
                            }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3
                                        className="font-semibold mb-2"
                                        style={{
                                            color: '#111111',
                                        }}
                                    >
                                        {workflow.title}
                                    </h3>

                                    <p
                                        className="text-sm"
                                        style={{ color: '#6B7280' }}
                                    >
                                        {workflow.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() =>
                                        updateSetting(
                                            workflow.id,
                                            !settings?.[workflow.id]
                                        )
                                    }
                                    className="
    px-4
    py-2
    rounded-lg
    text-sm
    font-medium
    transition-colors
  "
                                    style={{
                                        backgroundColor: settings?.[workflow.id]
                                            ? '#E07B39'
                                            : '#111111',

                                        color: '#FAFAF8',
                                    }}
                                >
                                    {settings?.[workflow.id]
                                        ? 'Enabled'
                                        : 'Enable'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showSkeleton ? (
                <div
                    className="
      border
      rounded-2xl
      mt-4
      p-5
      mb-6
      animate-pulse
    "
                    style={{
                        borderColor: '#E5E7EB',
                        backgroundColor: '#FFFFFF',
                    }}
                >
                    <div className="h-6 w-40 bg-gray-200 rounded mb-6" />

                    <div className="space-y-4">
                        <div>
                            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                            <div className="h-12 bg-gray-200 rounded-xl" />
                        </div>

                        <div>
                            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                            <div className="h-12 bg-gray-200 rounded-xl" />
                        </div>

                        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                    </div>
                </div>
            ) : (
                <div
                    className="border rounded-2xl mt-4 p-5 mb-6"
                    style={{
                        borderColor: '#E5E7EB',
                        backgroundColor: '#FFFFFF',
                    }}
                >
                    <h2
                        className="text-lg font-semibold mb-4"
                        style={{
                            fontFamily: "'Fraunces', serif",
                        }}
                    >
                        Email Settings
                    </h2>

                    <div className="grid gap-4">
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                            >
                                Sender Name
                            </label>

                            <input
                                value={senderName}
                                onChange={(e) =>
                                    setSenderName(e.target.value)
                                }
                                className="w-full border rounded-xl px-4 py-3"
                                placeholder="Flow by Hamster"
                            />
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                            >
                                Reply-To Email
                            </label>

                            <input
                                value={replyToEmail}
                                onChange={(e) =>
                                    setReplyToEmail(e.target.value)
                                }
                                className="w-full border rounded-xl px-4 py-3"
                                placeholder="hello@yourbusiness.com"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={saveEmailSettings}
                                disabled={savingEmail}
                                className="
        px-4
        py-2
        rounded-lg
        text-sm
        font-medium
        transition-all
    "
                                style={{
                                    backgroundColor:
                                        emailSaved
                                            ? '#16A34A'
                                            : '#111111',

                                    color: '#FAFAF8',

                                    opacity: savingEmail
                                        ? 0.8
                                        : 1,
                                }}
                            >
                                {savingEmail
                                    ? 'Saving...'
                                    : emailSaved
                                        ? 'Saved ✓'
                                        : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}



            <div
                className="border rounded-2xl mt-4 p-5 mb-6"
                style={{
                    borderColor: '#E5E7EB',
                    backgroundColor: '#FFFFFF',
                }}
            >
                <h2
                    className="text-lg font-semibold mb-4"
                    style={{
                        fontFamily: "'Fraunces', serif",
                    }}
                >
                    Email Templates
                </h2>

                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Template
                        </label>

                        <select
                            value={selectedTemplateId ?? ''}
                            onChange={(e) =>
                                handleTemplateSelect(
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-xl px-4 py-3"
                        >
                            {templates.map((template) => (
                                <option
                                    key={template.id}
                                    value={template.id}
                                >
                                    {template.template_type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Subject
                        </label>

                        <input
                            value={templateSubject}
                            onChange={(e) =>
                                setTemplateSubject(
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-xl px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email Body
                        </label>

                        <textarea
                            rows={8}
                            value={templateBody}
                            onChange={(e) =>
                                setTemplateBody(
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-xl px-4 py-3"
                        />
                    </div>

                    <div
                        className="text-xs"
                        style={{ color: '#6B7280' }}
                    >
                        Available Variables:
                        <br />
                        {'{{customer_name}}'}
                        <br />
                        {'{{business_name}}'}
                        <br />
                        {'{{sender_name}}'}
                    </div>

                    <div>
                        <button
                            onClick={saveTemplate}
                            disabled={savingTemplate}
                            className="
                    px-4
                    py-2
                    rounded-lg
                    text-sm
                    font-medium
                "
                            style={{
                                backgroundColor:
                                    savingTemplate
                                        ? '#6B7280'
                                        : '#111111',
                                color: '#FAFAF8',
                            }}
                        >
                            {savingTemplate
                                ? 'Saving...'
                                : templateSaved
                                    ? 'Saved ✓'
                                    : 'Save Template'}
                        </button>

                        <button
                            onClick={sendTestEmail}
                            disabled={sendingTestEmail}
                            className="
      px-4
      py-2
      rounded-lg
      text-sm
      font-medium
      ml-2
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
                            style={{
                                backgroundColor: '#E07B39',
                                color: '#FFFFFF',
                            }}
                        >
                            {sendingTestEmail
                                ? 'Sending...'
                                : 'Send Test Email'}
                        </button>
                    </div>
                </div>
            </div>



        </div>
    )
}