import { useBusiness } from '@/hooks/useBusiness'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'


export default function SettingsPage() {
    const { business, refetch } = useBusiness()
    const [slug, setSlug] = useState('')

    const [operatingHours, setOperatingHours] =
        useState<any>({})
    
    const [name, setName] = useState('')
    const [businessType, setBusinessType] =
        useState('')

    const [saving, setSaving] = useState(false)


    const handleSave = async () => {
        if (!business) return

        try {
            setSaving(true)

            const { error } = await supabase
                .from('businesses')
                .update({
                    name,
                    business_type: businessType,
                    slug,
                    operating_hours: operatingHours,
                })
                .eq('id', business.id)

            if (error) throw error

            await refetch()

            alert('Business updated successfully')
        } catch (err) {
            console.error(err)
            alert('Failed to update business')
        } finally {
            setSaving(false)
        }
        
    }


    useEffect(() => {
        if (!business) return

        setName(business.name ?? '')
        setBusinessType(
            business.business_type ?? ''
        )

        setSlug(business.slug ?? '')

        setOperatingHours(
            business.operating_hours ?? {}
        )
    }, [business])

    const DAYS = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ]


    return (
        <div className="p-6 lg:p-8">
            <div className="mb-8">
                <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-[#E07B39]">
                    Settings
                </p>

                <h1
                    className="text-4xl mb-3"
                    style={{
                        fontFamily: "'Fraunces', serif",
                        color: '#111111',
                    }}
                >
                    Business Settings
                </h1>

                <p className="text-gray-500">
                    Manage your business information and booking preferences.
                </p>
            </div>

            <div className="bg-white border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-6">
                    Business Profile
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Business Name
                        </label>

                        <input
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                                }
                            className="w-full border rounded-lg px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium">
                            Business Type
                        </label>

                        <input
                            value={businessType}
                            onChange={(e) =>
                                setBusinessType(e.target.value)
                            }
                            className="w-full border rounded-lg px-4 py-3"
                        />
                    </div>

                    <div
                        className="
        fixed
        bottom-6
        right-6
        z-50
    "
                    >
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="
            px-6
            py-3
            rounded-xl
            text-white
            font-medium
            shadow-lg
            bg-[#E07B39]
            hover:opacity-90
            transition-all
        "
                        >
                            {saving
                                ? 'Saving...'
                                : 'Save Changes'}
                        </button>
                    </div>

                    <div className="bg-white border rounded-xl p-6 mt-6">
                        <h2 className="text-lg font-semibold mb-6">
                            Public Booking Link
                        </h2>

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Booking Slug
                            </label>

                            <input
                                value={slug}
                                onChange={(e) => {
                                    const value = e.target.value
                                        .toLowerCase()
                                        .replace(/\s+/g, '-')
                                        .replace(/[^a-z0-9-]/g, '')

                                    setSlug(value)
                                }}
                                className="w-full border rounded-lg px-4 py-3"
                            />
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500">
                                Public URL
                            </p>

                            <p className="font-medium mt-1">
                                {window.location.origin}/book/{slug}
                            </p>
                        </div>

                        <div className="bg-white border rounded-xl p-6 mt-6">
    <h2 className="text-lg font-semibold mb-6">
        Operating Hours
    </h2>

    <div className="space-y-4">
        {DAYS.map((day) => (
            <div
                key={day}
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-4
                    gap-3
                    items-center
                "
            >
                <div className="font-medium capitalize">
                    {day}
                </div>

                <input
                    type="time"
                    value={
                        operatingHours?.[day]?.start ??
                        '09:00'
                    }
                    onChange={(e) =>
                        setOperatingHours({
                            ...operatingHours,
                            [day]: {
                                ...operatingHours?.[day],
                                start: e.target.value,
                            },
                        })
                    }
                    className="border rounded-lg px-3 py-2"
                />

                <input
                    type="time"
                    value={
                        operatingHours?.[day]?.end ??
                        '17:00'
                    }
                    onChange={(e) =>
                        setOperatingHours({
                            ...operatingHours,
                            [day]: {
                                ...operatingHours?.[day],
                                end: e.target.value,
                            },
                        })
                    }
                    className="border rounded-lg px-3 py-2"
                />

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={
                            operatingHours?.[day]?.open ??
                            true
                        }
                        onChange={(e) =>
                            setOperatingHours({
                                ...operatingHours,
                                [day]: {
                                    ...operatingHours?.[day],
                                    open: e.target.checked,
                                },
                            })
                        }
                    />

                    <span>
                        {
                            operatingHours?.[day]?.open
                                ? 'Open'
                                : 'Closed'
                        }
                    </span>
                </label>
            </div>
        ))}
    </div>
                        </div>
                        
                    </div>


                    <button
                        type="button"
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `${window.location.origin}/book/${slug}`
                            )
                        }}
                        className="
                        mt-4
                        px-4
                        py-2
                        rounded-lg
                        border
                    "
                    >
                        Copy Link
                    </button>

                </div>
            </div>
        </div>
    )
}