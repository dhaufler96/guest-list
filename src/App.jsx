
import { useState, useEffect } from "react";

function App() {
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    async function fetchGuests() {
      try {
        const response = await fetch(
          "https://fsa-crud-2aa9294fe819.herokuapp.com/api/YOUR_COHORT_CODE/guests"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch guests");
        }

        const result = await response.json();

        setGuests(result.data);
      } catch (error) {
        console.error("Error fetching guests:", error);
        setError("Unable to load guests. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchGuests();
  }, []);

  
  async function fetchGuestDetails(id) {
    setDetailsLoading(true);
    setDetailsError(null);

    try {
      const response = await fetch(
        `https://fsa-crud-2aa9294fe819.herokuapp.com/api/YOUR_COHORT_CODE/guests/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch guest details");
      }

      const result = await response.json();

      setSelectedGuest(result.data);
    } catch (error) {
      console.error("Error fetching guest details:", error);
      setDetailsError("Unable to load guest details. Please try again.");
    } finally {
      setDetailsLoading(false);
    }
  }

  return (
    <main>
      <h1>Guest List</h1>

      {loading ? (
        <p>Loading guests...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : detailsLoading ? (
        <p>Loading guest details...</p>
      ) : detailsError ? (
        <section>
          <p role="alert">{detailsError}</p>
          <button
            onClick={() => {
              setDetailsError(null);
              setSelectedGuest(null);
            }}
          >
            Back to Guest List
          </button>
        </section>
      ) : selectedGuest ? (
        <section>
          <h2>{selectedGuest.name}</h2>

          <p>Email: {selectedGuest.email}</p>
          <p>Phone: {selectedGuest.phone}</p>
          <p>Job: {selectedGuest.job}</p>
          <p>Bio: {selectedGuest.bio}</p>

          <button onClick={() => setSelectedGuest(null)}>
            Back to Guest List
          </button>
        </section>
      ) : (
        <ul>
          {guests.map((guest) => (
            <li key={guest.id}>
              <button onClick={() => fetchGuestDetails(guest.id)}>
                <p>{guest.name}</p>
                <p>{guest.email}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;