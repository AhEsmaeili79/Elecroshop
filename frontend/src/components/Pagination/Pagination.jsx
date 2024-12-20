import './pagination.css';

const Pagination = ({ totalProducts, productsPerPage, paginate, currentPage }) => {
    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    // Generate array of page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Handle page click
    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            paginate(pageNumber); // Update the current page in parent component
        }
    };

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
                {/* Previous Button */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link page-link-prev"
                        aria-label="Previous"
                        disabled={currentPage === 1}
                        onClick={() => handlePageClick(currentPage - 1)}
                    >
                        <span aria-hidden="true">
                            <i className="icon-long-arrow-left"></i>
                        </span>
                        Prev
                    </button>
                </li>

                {/* Page Numbers */}
                {pageNumbers.map((page) => (
                    <li
                        key={page}
                        className={`page-item ${page === currentPage ? "active" : ""}`}
                        aria-current={page === currentPage ? "page" : undefined}
                    >
                        <button
                            className="page-link"
                            onClick={() => handlePageClick(page)}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {/* Next Button */}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                        className="page-link page-link-next"
                        aria-label="Next"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageClick(currentPage + 1)}
                    >
                        Next
                        <span aria-hidden="true">
                            <i className="icon-long-arrow-right"></i>
                        </span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
