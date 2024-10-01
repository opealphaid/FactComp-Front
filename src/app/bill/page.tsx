"use client";

import React, { useState, useEffect } from 'react';
import { FaSearch, FaDownload, FaTrashAlt, FaEye } from 'react-icons/fa';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import BillDetailsModal from '@/components/layouts/modalBillDetails';
import { PATH_URL_BACKEND } from '@/utils/constants';


interface FormattedBill {
    documentNumber: string;
    client: string;
    date: string;
    total: string;
    estado: string;
    codigoSucursal: number;
    direccion?: string;
    codigoPuntoVenta: number;
    fechaEmision?: string;
    nombreRazonSocial?: string;
    codigoTipoDocumentoIdentidad: number;
    numeroDocumento?: string;
    codigoMetodoPago: number;
    numeroTarjeta?: string;
    montoTotal?: number;
    descuentoAdicional?: number;
}

const BillList = () => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState<FormattedBill | null>(null);
    const [bills, setBills] = useState<FormattedBill[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(bills.length / rowsPerPage);
    const paginatedBills = bills.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/factura`);
                if (response.ok) {
                    const data = await response.json();
                    const formattedData = data.map((bill: any) => ({
                        documentNumber: bill.numeroDocumento,
                        client: bill.nombreRazonSocial,
                        date: new Date(bill.fechaEmision).toLocaleDateString(),
                        total: bill.montoTotal.toFixed(2),
                        estado: 'Válida',
                        codigoSucursal: bill.codigoSucursal,
                        codigoPuntoVenta: bill.codigoPuntoVenta,
                        codigoTipoDocumentoIdentidad: bill.codigoTipoDocumentoIdentidad,
                        codigoMetodoPago: bill.codigoMetodoPago,
                    }));
                    setBills(formattedData);
                } else {
                    console.error('Error fetching bills');
                }
            } catch (error) {
                console.error('Error fetching bills:', error);
            }

        };
        fetchBills();
    }, []);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {

        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const openModal = (bill: FormattedBill) => {
        setSelectedBill(bill);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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

    return (

        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col w-full min-h-screen">
                <Header />
<<<<<<< HEAD

                <div className="flex-grow overflow-auto bg-gray-100">
=======
                <div className="flex-grow overflow-auto bg-gray-50">
>>>>>>> a77a38e6d45ee1a8891275c126490f643a328996
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-6 text-gray-700">Lista de Facturas</h1>
                        <div className="flex items-center justify-between mb-6">
<<<<<<< HEAD
                            <button className="bg-firstColor text-white py-3 px-6 rounded-lg hover:bg-firstColor text-lg">
                                EMITIR FACTURA
                            </button>

=======
>>>>>>> a77a38e6d45ee1a8891275c126490f643a328996
                            <div className="relative flex items-center w-1/2">
                                <input
                                    type="text"
                                    placeholder="Buscar factura"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border border-gray-300 rounded-lg py-3 px-4 w-full text-lg"
                                />
                                <FaSearch className="absolute right-3 text-gray-500 text-2xl" />
                            </div>

                            <div className="inline-flex rounded-lg overflow-hidden">
                                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 flex items-center">
                                    <FaDownload className="mr-2" /> PDF
                                </button>

                                <button className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-2 px-4">
                                    DOCX
                                </button>
                                <button className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4">
                                    XML
                                </button>
                                <button className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4">
                                    TXT
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex">
                                <select className="border border-gray-300 rounded-lg py-2 px-4 text-gray-700">
                                    <option>Tipo Factura 1</option>
                                    <option>Tipo Factura 2</option>
                                    <option>Tipo Factura 3</option>
                                </select>
                            </div>

                            <div className="flex space-x-4">
                                <div className="flex flex-col items-start">
                                    <label className="block text-base font-bold text-gray-700">Fecha Inicio</label>
                                    <input
                                        className="mt-1 block w-full rounded-md border bg-white px-3 py-2 shadow-sm focus:border-colorAlpha focus:outline-none focus:ring-colorAlpha sm:text-sm border-colorAlpha"
                                        type="date"
                                        value={startDate.toISOString().split('T')[0]}
                                        onChange={(e) => setStartDate(new Date(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col items-start">
                                    <label className="block text-base font-bold text-gray-700">Fecha Fin</label>
                                    <input
                                        className="mt-1 block w-full rounded-md border bg-white px-3 py-2 shadow-sm focus:border-colorAlpha focus:outline-none focus:ring-colorAlpha sm:text-sm border-colorAlpha"
                                        type="date"
                                        value={endDate.toISOString().split('T')[0]}
                                        onChange={(e) => setEndDate(new Date(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
<<<<<<< HEAD
                            <table className="w-full text-left rtl:text-right text-black">
                                <thead className="text-white uppercase bg-sixthColor text-center">
                                <tr>
                                    <th scope="col" className="px-4 py-3">N° Documento</th>
                                    <th scope="col" className="px-4 py-3">Cliente</th>
                                    <th scope="col" className="px-4 py-3">Fecha</th>
                                    <th scope="col" className="px-4 py-3">Tipo Documento</th>
                                    <th scope="col" className="px-4 py-3">Modalidad</th>
                                    <th scope="col" className="px-4 py-3">Operación</th>
                                </tr>
=======
                            <table className="min-w-full bg-white border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">N° Documento</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Cliente</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Fecha</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Total Facturado</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Estado</th>
                                        <th className="px-4 py-2 border text-left font-semibold text-gray-700">Operación</th>
                                    </tr>
>>>>>>> a77a38e6d45ee1a8891275c126490f643a328996
                                </thead>

                                <tbody>
<<<<<<< HEAD
                                {paginatedBills.map((bill, index) => (
                                    <tr key={index} className="bg-white border-b border-slate-300 hover:bg-slate-100">
                                    <td className="px-6 py-4 text-center aling-middle">{bill.documentNumber}</td>
                                    <td className="px-6 py-4 text-center align-middle">{bill.client}</td>
                                    <td className="px-6 py-4 text-center align-middle">{bill.date}</td>
                                    <td className="px-6 py-4 text-center align-middle">{bill.documentType}</td>
                                    <td className="px-6 py-4 text-center align-middle">
                                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                                        {bill.modality}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex justify-center items-center space-x-4 align-middle">
                                        <button className="text-seventhColor hover:text-red-700 text-lg">
                                        <FaTrashAlt />
                                        </button>
                                        <button
                                        className="text-eighthColor hover:text-lime-600 text-lg"
                                        onClick={() => openModal(bill)}
                                        >
                                        <FaEye />
                                        </button>
                                    </td>
                                    </tr>
                                ))}
=======
                                    {paginatedBills.map((bill, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 border text-gray-800">{bill.documentNumber}</td>
                                            <td className="px-4 py-2 border text-gray-800">{bill.client}</td>
                                            <td className="px-4 py-2 border text-gray-800">{bill.date}</td>
                                            <td className="px-4 py-2 border text-gray-800">${bill.total}</td>
                                            <td className="px-4 py-2 border">
                                                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                                                    {bill.estado}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border flex space-x-2">
                                                <button className="text-red-500 hover:text-red-700">
                                                    <FaTrashAlt />
                                                </button>
                                                <button
                                                    className="text-blue-500 hover:text-blue-700"
                                                    onClick={() => openModal(bill)}
                                                >
                                                    <FaEye />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
>>>>>>> a77a38e6d45ee1a8891275c126490f643a328996
                                </tbody>
                            </table>
                            </div>


                        <div className="flex space-x-1 justify-center mt-6">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            >
                                Prev
                            </button>

                            {getPageNumbers().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`min-w-9 rounded-full border py-2 px-3.5 text-center text-sm transition-all shadow-sm ${page === currentPage ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800'} focus:bg-slate-800 focus:text-white active:border-slate-800 active:bg-slate-800`}
                                >
                                    {page}

                                </button>
                            ))}

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="min-w-9 rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                            >
                                Next
                            </button>
                        </div>

                        <div className="flex space-x-1 justify-center mt-2">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                                Mostrando página <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> de <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                            </span>
                        </div>
                    </div>

                </div>
                <BillDetailsModal isOpen={isModalOpen} onClose={closeModal} bill={selectedBill} />
            </div>
        </div>
    );
};

export default BillList;