import React, { useState } from "react";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

function SearchInput({onSearch}) {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSearch(query);
    };

    return (
        <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            name="query"
                            value={query}
                            onChange={handleSearch}
                            placeholder={"Search..."} />
                        <button type="submit" className="btn btn-primary">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default SearchInput;