import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ itemsPerPage, setItemsPerPage, currentPage, setCurrentPage, totalItems }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="flex flex-wrap justify-between items-center bg-white p-3 rounded-4xl shadow-md">
            {/* Items per page selector */}
            <div className="flex items-center gap-2 px-2">
                <span className="text-gray-700 font-medium">Items per page:</span>
                <select 
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-1 focus:ring focus:ring-blue-300"
                >
                    {[8, 12, 16, 20].map(value => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-4">
                <span className="text-gray-700">
                    {currentPage * itemsPerPage - itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
                </span>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination