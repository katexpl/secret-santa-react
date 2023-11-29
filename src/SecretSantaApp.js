import { useEffect, useState } from "react";
import "./styles/index.css";
import supabase from "./config/supabaseClient";
import { SantaAnimatedIcon } from './components/SantaAnimatedIcon';

function SecretSantaApp() {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [receiver, setReceiver] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      const { data, error } = await supabase.from("secretSanta").select("*");
      if (error) {
        console.error("Error fetching participants:", error.message);
      } else {
        setParticipants(data);

        const isCurrentSet = data.some((participant) => participant.current !== null);
        if (!isCurrentSet) {
          generateSecretSantas(data);
        }
      }
    };

    fetchParticipants();
  }, []);

  useEffect(() => {
    const isSelectionDisabled = localStorage.getItem("secretSantaSelected");
    const storedReceiver = localStorage.getItem("secretSantaReceiver");

    if (isSelectionDisabled && storedReceiver) {
      setReceiver(storedReceiver);

      const selectInput = document.getElementById("mapped-names");
      if (selectInput) {
        selectInput.disabled = true;
      }
    }
  }, [participants]);

  const shuffleParticipantsArray = (array, offset) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.slice(offset).concat(array.slice(0, offset));
  };

  const generateSecretSantas = async (participants) => {
    const updatedParticipants = [...participants];
    const shuffledParticipants = shuffleParticipantsArray(updatedParticipants, 0);

    const getNextAvailableParticipant = (currentIndex, usedNames) => {
      let nextIndex = (currentIndex + 1) % shuffledParticipants.length;

      while (
        usedNames.has(shuffledParticipants[nextIndex].name) ||
        updatedParticipants[currentIndex].past === shuffledParticipants[nextIndex].name ||
        updatedParticipants[currentIndex].partner === shuffledParticipants[nextIndex].name
      ) {
        nextIndex = (nextIndex + 1) % shuffledParticipants.length;
      }

      return nextIndex;
    };

    const usedNames = new Set();

    for (let i = 0; i < shuffledParticipants.length; i++) {
      const currentParticipant = shuffledParticipants[i];
      const nextIndex = getNextAvailableParticipant(i, usedNames);
      const nextParticipant = shuffledParticipants[nextIndex];

      usedNames.add(nextParticipant.name);

      currentParticipant.current = nextParticipant.name;
    }

    console.log(updatedParticipants);
    await updateDatabase(updatedParticipants);
    setParticipants(shuffledParticipants);
  };

  const updateDatabase = async (updatedParticipants) => {
    const updates = updatedParticipants.map((p) => {
      return supabase
        .from("secretSanta")
        .update({ current: p.current, past: p.past })
        .eq("id", p.id);
    });

    await Promise.all(updates);
  };

  const handleParticipantSelect = (event) => {
    const selectedName = event.target.value;
    const selectedParticipant = participants.find((p) => p.name === selectedName);
    setSelectedParticipant(selectedParticipant);

    const isSelectionDisabled = localStorage.getItem("secretSantaSelected");

    if (isSelectionDisabled) {
      return;
    }
  };

  useEffect(() => {
    generateReceiver();
  }, [selectedParticipant]);

  const generateReceiver = () => {
    if (selectedParticipant) {
      const receiverName = selectedParticipant.current;

      localStorage.setItem("secretSantaSelected", "true");
      localStorage.setItem("secretSantaReceiver", receiverName);

      setReceiver(receiverName);

      const selectInput = document.getElementById("mapped-names");
      if (selectInput) {
        selectInput.disabled = true;
      }
    }
  };

  return (
    <div className="wrapper">
      <div className="main-content-wrapper">
        <h1>Secret Santa Game</h1>
        <div className="select-wrapper">
          <select
            id="mapped-names"
            className="styled-input"
            onChange={handleParticipantSelect}
          >
            <option value="">Select Name</option>
            {participants.map((participant) => (
              <option key={participant.id} value={participant.name}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>
        <div className="results">
          {receiver && (
            <div>
              <h3>Your Secret Santa Receiver:</h3>
              <p>{receiver}</p>
            </div>
          )}
        </div>
      </div>
      <SantaAnimatedIcon />
    </div>
  );
}

export default SecretSantaApp;
