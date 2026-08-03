import { usePage } from '@inertiajs/react';

export default function ApplicationLogo(props) {
    const { sekolah } = usePage().props;

    if (sekolah?.logo_url) {
        return (
            <img
                src={sekolah.logo_url}
                alt={sekolah.nama_sekolah || "Logo Yayasan"}
                {...props}
            />
        );
    }

    return (
        <img
            src="/images/logoppl.png"
            alt="Logo Default"
            {...props}
        />
    );
}
