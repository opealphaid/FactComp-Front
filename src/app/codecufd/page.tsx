"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { PATH_URL_BACKEND } from '@/utils/constants';

interface CUFD {
    id: number;
    codigo: string;
    fechaInicio: string;
    fechaVigencia: string;
    vigente: boolean;
}

const CUFDList = () => {
    const [cufds, setCUFDs] = useState<CUFD[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const fetchCUFDs = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/codigos/cufd/activo/1`);
            const data = await response.json();
            setCUFDs(data);
        } catch (error) {
            console.error('Error fetching CUFDs:', error);
            Swal.fire('Error', 'Error al obtener los registros de CUFD', 'error');
        }
    };

    useEffect(() => {
        fetchCUFDs();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const filteredCUFDs = Array.isArray(cufds) ? cufds.filter((cufd) =>
        Object.values(cufd)
            .some((field) => field && field.toString().toLowerCase().includes(filter.toLowerCase()))
    ) : [];

    const totalPages = Math.ceil(filteredCUFDs.length / rowsPerPage);
    const paginatedCUFDs = filteredCUFDs.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleEmitCUFD = async () => {
        Swal.fire({
            title: 'Emitir CUFD',
            text: '¿Deseas emitir un nuevo CUFD?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Emitir',
            cancelButtonText: 'Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${PATH_URL_BACKEND}/codigos/obtener-cufd/1`, {
                        method: 'POST',
                    });
                    if (response.ok) {
                        Swal.fire('¡Emitido!', 'El CUFD ha sido emitido.', 'success');
                        // Actualizamos la lista de CUFD después de emitir uno nuevo
                        fetchCUFDs();
                    } else {
                        Swal.fire('Error', 'No se pudo emitir el CUFD.', 'error');
                    }
                } catch (error) {
                    console.error('Error al emitir el CUFD:', error);
                    Swal.fire('Error', 'Hubo un problema al emitir el CUFD.', 'error');
                }
            }
        });
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 4;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />

                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold mb-6 text-gray-700">Registros de CUFD</h2>
                            <button
                                className="bg-sixthColor text-white py-2 px-4 rounded-lg hover:bg-thirdColor text-lg"
                                onClick={handleEmitCUFD}
                            >
                                Emitir CUFD <FaPlus className="inline-block ml-2" />
                            </button>
                        </div>
                        <div className="flex justify-between mb-4">
                            <input
                                type="text"
                                placeholder="Buscar CUFD por id o estado..."
                                className="border p-2 rounded-lg w-1/3"
                                value={filter}
                                onChange={handleFilterChange}
                            />
                        </div>

                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">ID</th>
                                        <th className="px-6 py-4 font-bold">CUFD</th>
                                        <th className="px-6 py-4 font-bold">Fecha/Hora Emisión</th>
                                        <th className="px-6 py-4 font-bold">Fecha/Hora Vencimiento</th>
                                        <th className="px-6 py-4 font-bold">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCUFDs.map((cufd) => (
                                        <tr key={cufd.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4">{cufd.id}</td>
                                            <td className="px-6 py-4">{cufd.codigo}</td>
                                            <td className="px-6 py-4">{formatDate(cufd.fechaInicio)}</td>
                                            <td className="px-6 py-4">{formatDate(cufd.fechaVigencia)}</td>
                                            <td className="px-6 py-4">
                                                {cufd.vigente ? 'Activo' : 'Inactivo'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex space-x-1 justify-center mt-6">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            >
                                Prev
                            </button>

                            {getPageNumbers().map((number) => (
                                <button
                                    key={number}
                                    onClick={() => setCurrentPage(number)}
                                    className={`min-w-9 rounded-full border py-2 px-3.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 ${currentPage === number ? 'bg-slate-800 text-white' : ''}`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CUFDList;