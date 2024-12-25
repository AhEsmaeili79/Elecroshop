import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchToggle = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/product?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="header-search">
            <a href="#" className="search-toggle" role="button" title="Search">
                <i className="icon-search"></i>
            </a>
            <form onSubmit={handleSearch}>
                <div className="header-search-wrapper">
                    <label htmlFor="q" className="sr-only">جستجو</label>
                    <input
                        type="search"
                        className="form-control"
                        name="q"
                        id="q"
                        placeholder="جستجو..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        required
                    />
                </div>
            </form>
        </div>
    );
};

export default SearchToggle;
