import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchComponent = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/product?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="header-center">
            {/* Search component */}
            <div className="header-search header-search-extended header-search-visible d-none d-lg-block">
                <form onSubmit={handleSearch}>
                    <div className="header-search-wrapper search-wrapper-wide">
                        <label htmlFor="q" className="sr-only">Search</label>
                        <button className="btn btn-primary" type="submit">
                            <i className="icon-search"></i>
                        </button>
                        <input
                            type="search"
                            className="form-control"
                            name="q"
                            id="q"
                            placeholder="Search product ..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            required
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchComponent;
