"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/commons/sidebar';
import Header from '@/components/commons/header';
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import CreateEditClientModal from '@/components/layouts/modalCreateEditClient';
import { PATH_URL_BACKEND } from '@/utils/constants';
import CashierSidebar from '@/components/commons/cashierSidebar';
import ModalContingency from '@/components/layouts/modalContingency';

interface Customer {
    id: number;
    nombreRazonSocial: string;
    codigoTipoDocumentoIdentidad: number;
    numeroDocumento: string;
    complemento: string | null;
    codigoCliente: string;
    email: string;
}

interface UserRole {
    role: 'ADMIN' | 'CAJERO';
}

const ClientList = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentCustomer, setCurrentCustomer] = useState<Customer>({
        id: 0,
        nombreRazonSocial: '',
        codigoTipoDocumentoIdentidad: 0,
        numeroDocumento: '',
        complemento: '',
        codigoCliente: '',
        email: '',
    });
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [userRole, setUserRole] = useState<UserRole['role']>('CAJERO');
    const [isContingencyModalOpen, setIsContingencyModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserRole = () => {
            const storedRole = localStorage.getItem('userRole');
            if (storedRole === 'ADMIN' || storedRole === 'CAJERO') {
                setUserRole(storedRole);
            }
        };
        fetchUserRole();
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/api/clientes`);
                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    const checkServerCommunication = async () => {
        try {
            const response = await fetch(`${PATH_URL_BACKEND}/contingencia/verificar-comunicacion`);
            if (!response.ok) {
                if (response.status === 500) {
                    Swal.fire({
                        title: 'La comunicación con impuestos falló',
                        text: '¿Desea entrar en modo de contingencia?',
                        icon: 'error',
                        showCancelButton: true,
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                        reverseButtons: true,
                        customClass: {
                            confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
                            cancelButton: 'bg-blue-500 text-white px-4 py-2 rounded-md',
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setIsContingencyModalOpen(true);
                        } else {
                            console.log('Modo de contingencia cancelado.');
                        }
                    });
                } else {
                    console.error("Error de comunicación con el servidor:", response.statusText);
                }
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            Swal.fire({
                title: 'La comunicación con impuestos falló',
                text: '¿Desea entrar en modo de contingencia?',
                icon: 'error',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md',
                    cancelButton: 'bg-blue-500 text-white px-4 py-2 rounded-md',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    setIsContingencyModalOpen(true);
                } else {
                    console.log('Modo de contingencia cancelado.');
                }
            });
        }
    };


    useEffect(() => {
        checkServerCommunication();
    }, []);
    const closeModal = () => setIsContingencyModalOpen(false);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const filteredCustomers = customers.filter((customer) =>
        Object.values(customer)
            .some((field) => field && field.toString().toLowerCase().includes(filter.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleEditCustomer = (id: number) => {
        const customer = customers.find((c) => c.id === id);
        if (customer) {
            setCurrentCustomer(customer);
            setIsModalOpen(true);
        }
    };

    const handleDeleteCustomer = (id: number) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'No podrás revertir esto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                setCustomers(customers.filter((c) => c.id !== id));
                Swal.fire('Eliminado!', 'El cliente ha sido eliminado.', 'success');
            }
        });
    };

    const handleAddOrEditCustomer = (customer: Customer) => {
        if (customer.id) {
            setCustomers(
                customers.map((c) => (c.id === customer.id ? { ...customer } : c))
            );
            Swal.fire('¡Actualizado!', 'El cliente ha sido actualizado.', 'success');
        } else {
            const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
            setCustomers([...customers, { ...customer, id: newId }]);
            Swal.fire('¡Agregado!', 'El cliente ha sido agregado exitosamente.', 'success');
        }
        setIsModalOpen(false);
        setCurrentCustomer({
            id: 0,
            nombreRazonSocial: '',
            codigoTipoDocumentoIdentidad: 0,
            numeroDocumento: '',
            complemento: '',
            codigoCliente: '',
            email: '',
        });
        setCurrentPage(1);
    };

    const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
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

    const renderOperationButtons = (customer: Customer) => {
        return (
            <div className="flex">
                {userRole === 'ADMIN' && (
                    <button
                        className="bg-red-200 hover:bg-red-300 p-2 rounded-l-lg flex items-center justify-center border border-red-300"
                        onClick={() => handleDeleteCustomer(customer.id)}
                    >
                        <FaTrashAlt className="text-black" />
                    </button>
                )}
                <button
                    className={`${userRole === 'ADMIN' ? 'rounded-r-lg' : 'rounded-lg'
                        } bg-blue-200 hover:bg-blue-300 p-2 flex items-center justify-center border border-blue-300`}
                    onClick={() => handleEditCustomer(customer.id)}
                >
                    <FaEdit className="text-black" />
                </button>
            </div>
        );
    };


    return (
        <div className="flex min-h-screen">
            {userRole === 'ADMIN' ? <Sidebar /> : <CashierSidebar />}
            <div className="flex flex-col w-full min-h-screen">
                <Header />

                <div className="flex-grow overflow-auto bg-gray-50">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-700">Gestión de Clientes</h2>

                        <div className="flex justify-end my-2">
                            
                        </div>
                        {/* Barra de búsqueda */}
                        <div className="flex justify-between mb-4">
                            <div>
                                <label htmlFor="itemsPerPage" className="mr-2 text-sm">Elementos por página:</label>
                                <select
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    className="border p-2 rounded-lg w-20"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                    <option value={40}>40</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <div className="relative flex items-center w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Buscar cliente por nombre o documento..."
                                    className="border border-gray-300 focus:border-firstColor focus:ring-firstColor focus:outline-none px-4 py-2 rounded-lg w-full shadow-sm text-sm placeholder-gray-400"
                                    value={filter}
                                    onChange={handleFilterChange}
                                />
                                <FaSearch className="absolute right-4 text-gray-500 text-xl pointer-events-none" />
                            </div>

                            <button
                                className="bg-principalColor text-white py-2 px-4 rounded-lg hover:bg-firstColor text-lg"
                                onClick={() => {
                                    setCurrentCustomer({
                                        id: 0,
                                        nombreRazonSocial: '',
                                        codigoTipoDocumentoIdentidad: 0,
                                        numeroDocumento: '',
                                        complemento: '',
                                        codigoCliente: '',
                                        email: '',
                                    });
                                    setIsModalOpen(true);
                                }}
                            >
                                Agregar Cliente <FaPlus className="inline-block ml-2" />
                            </button>
                            <CreateEditClientModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onSave={handleAddOrEditCustomer}
                                customer={currentCustomer}
                            />

                        </div>

                        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                            <table className="table-auto w-full bg-white">
                                <thead>
                                    <tr className="bg-fourthColor text-left text-gray-700">
                                        <th className="px-6 py-4 font-bold">Nombre/Razón Social</th>
                                        <th className="px-6 py-4 font-bold">Tipo Doc.</th>
                                        <th className="px-6 py-4 font-bold">Número Documento</th>
                                        <th className="px-6 py-4 font-bold">Complemento</th>
                                        <th className="px-6 py-4 font-bold">Código Cliente</th>
                                        <th className="px-6 py-4 font-bold">Email</th>
                                        <th className="px-6 py-4 font-bold">Operaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedCustomers.map((customer) => (
                                        <tr key={customer.id} className="border-b hover:bg-gray-50 text-black">
                                            <td className="px-6 py-4">{customer.nombreRazonSocial}</td>
                                            <td className="px-6 py-4">{customer.codigoTipoDocumentoIdentidad}</td>
                                            <td className="px-6 py-4">{customer.numeroDocumento}</td>
                                            <td className="px-6 py-4">{customer.complemento}</td>
                                            <td className="px-6 py-4">{customer.codigoCliente}</td>
                                            <td className="px-6 py-4">{customer.email}</td>
                                            <td className="px-6 py-4">
                                                {renderOperationButtons(customer)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        <div className="flex space-x-1 justify-center mt-6">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            >
                                Ant.
                            </button>

                            {getPageNumbers().map((number) => (
                                <button
                                    key={number}
                                    onClick={() => setCurrentPage(number)}
                                    className={`rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 ${currentPage === number ? 'bg-slate-800 text-white' : ''}`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="rounded-full border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            >
                                Sig.
                            </button>
                        </div>
                        <div className="flex space-x-1 justify-center mt-2">
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                                Mostrando página <span className="font-semibold text-gray-900 dark:text-black">{currentPage}</span> de <span className="font-semibold text-gray-900 dark:text-black">{totalPages}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {isContingencyModalOpen && (
                <ModalContingency isOpen={isContingencyModalOpen} onClose={closeModal} />
            )}
        </div>
    );
};

export default ClientList;
