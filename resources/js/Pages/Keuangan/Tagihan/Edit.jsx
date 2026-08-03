import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';

export default function TagihanEdit({ tagihan }) {
    const { data, setData, put, processing, errors } = useForm({
        nominal_tagihan: tagihan.nominal_tagihan,
        status: tagihan.status,
        jatuh_tempo: tagihan.jatuh_tempo,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('tagihan.update', tagihan.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Tagihan" />
            <div className="max-w-[700px] mx-auto pb-10">
                <div className="mb-6 flex items-center gap-4">
                    <Link href={route('tagihan.show', tagihan.siswa_id)} className="p-2 bg-white rounded-full hover:bg-slate-50 transition-colors shadow-sm border border-slate-200">
                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Edit Tagihan</h2>
                        <p className="text-sm text-slate-500">Penyesuaian nominal dan sisa tagihan</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="mb-6 pb-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Siswa</p>
                            <p className="font-bold text-slate-900">{tagihan.siswa?.nama_lengkap}</p>
                            <p className="text-sm text-slate-600">{tagihan.siswa?.nisn} &bull; Kelas {tagihan.siswa?.kelas?.nama_kelas}</p>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Detail Tagihan</p>
                            <p className="font-bold text-slate-900">{tagihan.kategori_tagihan?.nama_kategori}</p>
                            <p className="text-sm text-slate-600">{tagihan.bulan_tagihan || 'Sekali Bayar'}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nominal Tagihan Aktual (Rp)</label>
                            <input
                                type="number"
                                value={data.nominal_tagihan}
                                onChange={e => setData('nominal_tagihan', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                            />
                            {errors.nominal_tagihan && <div className="text-rose-500 text-xs mt-1">{errors.nominal_tagihan}</div>}
                            <p className="text-xs text-slate-500 mt-2">Mengubah nominal akan otomatis menyesuaikan proporsi 'Sisa Tagihan'. Jika tagihan dinaikkan Rp 50.000, maka sisa tagihan juga bertambah Rp 50.000.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Jatuh Tempo</label>
                                <input
                                    type="date"
                                    value={data.jatuh_tempo}
                                    onChange={e => setData('jatuh_tempo', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                                />
                                {errors.jatuh_tempo && <div className="text-rose-500 text-xs mt-1">{errors.jatuh_tempo}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Status Pembayaran</label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                                >
                                    <option value="belum_lunas">Belum Lunas</option>
                                    <option value="sebagian">Sebagian</option>
                                    <option value="lunas">Lunas</option>
                                </select>
                                {errors.status && <div className="text-rose-500 text-xs mt-1">{errors.status}</div>}
                                <p className="text-xs text-slate-500 mt-2">Status akan diakumulasikan otomatis oleh sistem berdasarkan sisa tagihan meskipun dirubah secara manual.</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                            <Link href={route('tagihan.show', tagihan.siswa_id)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Batal</Link>
                            <button disabled={processing} type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
                                <Save className="w-4 h-4" /> Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
