import Swal from 'sweetalert2';

export const confirmDelete = (
    onConfirm,
    message = 'Data yang dihapus tidak dapat dikembalikan!',
    title = 'Apakah Anda yakin?',
    confirmText = 'Ya, Hapus!',
    cancelText = 'Batal'
) => {
    Swal.fire({
        title: title,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', // red-500
        cancelButtonColor: '#64748b', // slate-500
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        customClass: {
            popup: 'rounded-2xl dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800',
            title: 'text-xl font-bold text-slate-800 dark:text-white',
            htmlContainer: 'text-sm text-slate-500 dark:text-slate-400',
            confirmButton: 'rounded-xl font-medium px-5 py-2.5 shadow-sm shadow-red-500/20',
            cancelButton: 'rounded-xl font-medium px-5 py-2.5',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
};
