import React, { useState, useEffect } from 'react';
import { FaUser, FaIdCard, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { PATH_URL_BACKEND } from '@/utils/constants';

interface Customer {
    id: number;
    nombreRazonSocial: string;
    numeroDocumento: string;
    complemento: string;
    codigoTipoDocumentoIdentidad: number;
    codigoCliente: string;
    email: string;
}

interface DocumentType {
    id: number;
    codigoClasificador: string;
    descripcion: string;
    codigoTipoParametro: string;
}

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Customer;
    onSave: (customer: Customer) => void;
}

const CreateEditClientModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, customer, onSave }) => {
    const [formData, setFormData] = useState<Customer>({ ...customer, codigoTipoDocumentoIdentidad: 0 });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [selectedDocumentType, setSelectedDocumentType] = useState<string>(customer.codigoTipoDocumentoIdentidad.toString());

    useEffect(() => {
        const fetchDocumentTypes = async () => {
            try {
                const response = await fetch(`${PATH_URL_BACKEND}/parametro/identidad`);
                if (response.ok) {
                    const data: DocumentType[] = await response.json();
                    setDocumentTypes(data);
                } else {
                    Swal.fire('Error', 'Error al obtener tipos de documentos de identidad', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }
        };

        fetchDocumentTypes();
    }, []);

    useEffect(() => {
        setFormData(customer);
        setErrors({});
    }, [customer, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = e.target.value;
        setSelectedDocumentType(selectedType);
        const selectedTypeObject = documentTypes.find((docType) => docType.codigoClasificador === selectedType);
        if (selectedTypeObject) {
            setFormData((prevData) => ({
                ...prevData,
                codigoTipoDocumentoIdentidad: parseInt(selectedTypeObject.codigoClasificador),
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.nombreRazonSocial) newErrors.nombreRazonSocial = 'Este campo es requerido';
        if (!formData.numeroDocumento) newErrors.numeroDocumento = 'Este campo es requerido';
        if (!formData.codigoCliente) newErrors.codigoCliente = 'Este campo es requerido';
        if (!formData.email) newErrors.email = 'Este campo es requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                let response;
                if (customer.id) {
                    // PUT
                    response = await fetch(`${PATH_URL_BACKEND}/api/clientes/${customer.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
                } else {
                    // POST
                    response = await fetch(`${PATH_URL_BACKEND}/api/clientes`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                    });
                }

                if (response.ok) {
                    const savedCustomer = await response.json();
                    onSave(savedCustomer);
                    onClose();
                    Swal.fire({
                        icon: 'success',
                        title: customer.id ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente',
                        text: '',
                    });
                } else {
                    Swal.fire('Error', 'Ocurrió un error al guardar el cliente', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }
        } else {
            Swal.fire('Error', 'Por favor, complete los campos obligatorios.', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg w-500">
                <div className="bg-white text-black text-2xl font-semibold p-4 rounded-t">
                    {customer.id ? 'Edición de Cliente' : 'Agregar nuevo Cliente'}
                </div>
                <div className="p-6 m-6">
                    <form className="grid md:grid-cols-2 gap-6">
                        {/* Razón Social */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="nombreRazonSocial"
                                value={formData.nombreRazonSocial}
                                onChange={handleInputChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Razón Social
                            </label>
                            {errors.nombreRazonSocial && <span className="text-red-500 text-sm">{errors.nombreRazonSocial}</span>}
                        </div>

                        {/* Correo Electrónico */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Correo Electrónico
                            </label>
                            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                        </div>

                        {/* Número Documento */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="numeroDocumento"
                                value={formData.numeroDocumento}
                                onChange={handleInputChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Número Documento
                            </label>
                            {errors.numeroDocumento && <span className="text-red-500 text-sm">{errors.numeroDocumento}</span>}
                        </div>

                        {/* Tipo Documento */}
                        <div className="relative z-0 w-full mb-5 group">
                            <select
                                value={selectedDocumentType}
                                onChange={handleDocumentTypeChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                required
                            >
                                <option value="">Selecciona un tipo de documento</option>
                                {documentTypes.map((docType) => (
                                    <option key={docType.id} value={docType.codigoClasificador}>
                                        {docType.descripcion}
                                    </option>
                                ))}
                            </select>
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Tipo Documento
                            </label>
                        </div>

                        {/* Complemento */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="complemento"
                                value={formData.complemento}
                                onChange={handleInputChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Complemento
                            </label>
                            {errors.complemento && <span className="text-red-500 text-sm">{errors.complemento}</span>}
                        </div>

                        {/* Código Cliente */}
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="text"
                                name="codigoCliente"
                                value={formData.codigoCliente}
                                onChange={handleInputChange}
                                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                required
                            />
                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                Código Cliente
                            </label>
                            {errors.codigoCliente && <span className="text-red-500 text-sm">{errors.codigoCliente}</span>}
                        </div>
                    </form>

                    <div className="flex justify-end mt-6">
                        <button onClick={onClose} className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2">
                            Cancelar
                        </button>
                        <button onClick={handleSubmit} className="px-6 py-2 bg-thirdColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2">
                            {customer.id ? 'Actualizar' : 'Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEditClientModal;
