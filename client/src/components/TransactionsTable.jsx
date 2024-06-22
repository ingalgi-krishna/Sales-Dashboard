import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/transactions.css';

const TransactionsTable = ({ month }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchTransactions();
    }, [month, currentPage, searchTerm]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/list-transactions`, {
                params: {
                    month,
                    search: searchTerm,
                    page: currentPage,
                    perPage: 5 // Adjust perPage as needed
                }
            });
            const { transactions, page, totalPages } = response.data;
            setTransactions(transactions);
            setCurrentPage(page);
            setTotalPages(totalPages);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    return (
        <div className='transactions'>
            <h2>Transactions</h2>
            <div className="search-bar">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by title, description, or price"
                    className="search-input"
                />
                <button onClick={fetchTransactions} className="search-button">Search</button>
            </div>
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="7">Loading...</td>
                        </tr>
                    ) : (
                        transactions.map(transaction => (
                            <tr key={transaction._id}>
                                <td>
                                    <img src={transaction.image} alt={transaction.title} className="transaction-image" />
                                </td>
                                <td>{transaction.title}</td>
                                <td>{transaction.description}</td>
                                <td>${transaction.price.toFixed(2)}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage <= 1} className="page-button">Previous</button>
                <span className="page-info">{`Page ${currentPage} of ${totalPages}`}</span>
                <button onClick={handleNextPage} disabled={currentPage >= totalPages} className="page-button">Next</button>
            </div>
        </div>
    );
};

export default TransactionsTable;
