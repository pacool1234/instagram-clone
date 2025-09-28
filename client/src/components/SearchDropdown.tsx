import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, FormControl, InputGroup, Spinner, ListGroup, Button } from "react-bootstrap";
import type { IUser } from "../domain/interfaces";
import { searchUser } from "../services/user.api";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	
	const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const searchForUsers = useCallback(async (debouncedQuery: string) => {
    if (debouncedQuery.length < 2) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchUser(debouncedQuery);
      const results = response.data.users as IUser[];
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    searchForUsers(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchForUsers]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);
  };

	const goToProfile = (userId: string) => {
		navigate(`/profile/${userId}`);
		setIsDropdownOpen(false);
	}

  const inputRef = React.useRef(null);

  const dropdownStyle = {
    position: "absolute",
    zIndex: 1000,
    width: "100%",
    marginTop: "5px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const showResults = isDropdownOpen && (searchResults.length > 0 || searchTerm.length >= 2 || isLoading);

  return (
    <Container className="d-flex flex-column align-items-center">
      <div className="w-100" style={{ maxWidth: "600px", position: "relative" }}>
        <InputGroup className="">
          <InputGroup.Text id="search-icon">🔍</InputGroup.Text>

          <FormControl
            ref={inputRef} // Attach ref for focus/blur handling
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
            placeholder="Search users by username"
            aria-label="Search users"
          />

          {isLoading && (
            <InputGroup.Text>
              <Spinner animation="border" size="sm" variant="primary" />
            </InputGroup.Text>
          )}

          {searchTerm.length > 0 && !isLoading && (
            <Button
              variant="outline-secondary"
              onClick={() => {
                setSearchTerm("");
                setSearchResults([]);
              }}
              aria-label="Clear search"
            >
              &times;
            </Button>
          )}
        </InputGroup>

        {showResults && (
          <ListGroup style={dropdownStyle} variant="flush">
            {isLoading && searchResults.length === 0 && (
              <ListGroup.Item className="text-center text-primary">
                <Spinner animation="grow" size="sm" className="me-2" />
                Searching...
              </ListGroup.Item>
            )}

            {!isLoading &&
              searchResults.length > 0 &&
              searchResults.map((user) => (
                // Use onMouseDown to prevent the input's onBlur event from firing before the click registers
                <ListGroup.Item
                  key={user._id}
                  action
                  onClick={() => goToProfile(user._id)}
                  className="d-flex align-items-center bg-info"
                >
                  <div>
                    <strong className="d-block">{user.username}</strong>
                    <small className="text-muted">{user.email}</small>
                  </div>
                </ListGroup.Item>
              ))}

            {!isLoading && searchTerm.length >= 2 && searchResults.length === 0 && (
              <ListGroup.Item className="text-center text-secondary">No users found for "{searchTerm}".</ListGroup.Item>
            )}

            {!isLoading && searchTerm.length < 2 && searchResults.length === 0 && (
              <ListGroup.Item className="text-center text-muted small">
                Keep typing (min 2 characters) to start searching.
              </ListGroup.Item>
            )}
          </ListGroup>
        )}
      </div>
    </Container>
  );
};

export default App;
