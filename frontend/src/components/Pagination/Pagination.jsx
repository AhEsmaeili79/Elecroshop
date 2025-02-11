import './pagination.css';

const Pagination = ({ totalProducts, productsPerPage, paginate, currentPage }) => {

    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handlePageClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            paginate(pageNumber);
        }
    };

    const toPersianNumbers = (num) => {
        return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
    };

    return (
        <nav aria-label="ناوبری صفحه">
            <ul className="pagination justify-content-center">

                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link page-link-prev"
                        aria-label="قبلی"
                        disabled={currentPage === 1}
                        onClick={() => handlePageClick(currentPage - 1)}
                    >
                        <span aria-hidden="true">
                            <i className="icon-long-arrow-right"></i>
                        </span>
                        قبلی
                    </button>
                </li>

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
                            {toPersianNumbers(page)}
                        </button>
                    </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                        className="page-link page-link-next"
                        aria-label="بعدی"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageClick(currentPage + 1)}
                    >
                        بعدی
                        <span aria-hidden="true">
                            <i className="icon-long-arrow-left"></i>
                        </span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
