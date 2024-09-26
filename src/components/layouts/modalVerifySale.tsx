"use client";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaMoneyBill, FaCreditCard, FaQrcode } from 'react-icons/fa';
import { PATH_URL_BACKEND } from '@/utils/constants';

const ModalVerifySale = ({ isOpen, onClose, products, total, onSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [clients, setClients] = useState([]);
    const [changeNeeded, setChangeNeeded] = useState(false);

    // Fetch the clients when the modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchClients = async () => {
                try {
                    const response = await fetch(`${PATH_URL_BACKEND}/api/clientes`);
                    if (response.ok) {
                        const data = await response.json();
                        setClients(data);
                    } else {
                        Swal.fire('Error', 'Error al obtener la lista de clientes', 'error');
                    }
                } catch (error) {
                    Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
                }
            };

            fetchClients();
        }
    }, [isOpen]);

    const handleValidate = () => {
        if (paymentMethod === 'Efectivo' && paymentAmount < total) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La cantidad pagada es insuficiente.',
            });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: 'Venta Realizada',
            text: 'La venta ha sido procesada con éxito.',
        }).then(() => {
            onSuccess({
                client: selectedClient,
                total: paymentAmount || total,
            });
        });
    };

    if (!isOpen) return null;

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">Verificación de Pago</h2>

                {/* Payment Method */}
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Método de Pago</label>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setPaymentMethod('Efectivo')}
                            className={`flex items-center p-2 border rounded ${paymentMethod === 'Efectivo' ? 'bg-fifthColor' : 'bg-gray-100'}`}
                        >
                            <FaMoneyBill className="mr-2" /> Efectivo
                        </button>
                        <button
                            onClick={() => setPaymentMethod('Tarjeta')}
                            className={`flex items-center p-2 border rounded ${paymentMethod === 'Tarjeta' ? 'bg-fifthColor' : 'bg-gray-100'}`}
                        >
                            <FaCreditCard className="mr-2" /> Tarjeta
                        </button>
                        <button
                            onClick={() => setPaymentMethod('QR')}
                            className={`flex items-center p-2 border rounded ${paymentMethod === 'QR' ? 'bg-fifthColor' : 'bg-gray-100'}`}
                        >
                            <FaQrcode className="mr-2" /> QR
                        </button>
                    </div>
                </div>

                {/* Payment Details for Efectivo */}
                {paymentMethod === 'Efectivo' && (
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">Cantidad Pagada</label>
                        <input
                            type="number"
                            className="border p-2 w-full"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                        />
                        {paymentAmount > total && (
                            <p className="text-green-500 mt-2">
                                Cambio: ${(paymentAmount - total).toFixed(2)}
                            </p>
                        )}
                    </div>
                )}

                {/* Client Selection */}
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">Cliente</label>
                    <select
                        className="border p-2 w-full"
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                    >
                        <option value="">Selecciona un cliente</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.nombreRazonSocial}>
                                {client.nombreRazonSocial} - {client.numeroDocumento}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Total */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold">Total: ${total.toFixed(2)}</h3>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        className="px-6 py-2 bg-sixthColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 mr-2"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="px-6 py-2 bg-thirdColor text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 ml-2"
                        onClick={handleValidate}
                    >
                        Validar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalVerifySale;
