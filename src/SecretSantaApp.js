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

    if (isSelectionDisabled) {
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
    const shuffledParticipants = shuffleParticipantsArray([...participants], 1);
    const updatedParticipants = shuffledParticipants.map((participant, index) => {
      const possibleSantas = shuffledParticipants.filter(
        (santa) =>
          santa.name !== participant.name &&
          santa.name !== participant.partner &&
          !(participant.past && JSON.parse(participant.past).includes(santa.name))
      );
      const nextIndex = index % possibleSantas.length;
      const secretSanta = possibleSantas[nextIndex];

      const newPast = participant.past
        ? JSON.parse(participant.past).concat(secretSanta.name)
        : [secretSanta.name];
      return {
        ...participant,
        current: secretSanta.name,
        past: JSON.stringify(newPast),
      };
    });

    updatedParticipants.forEach(async (participant) => {
      const { error } = await supabase
        .from("secretSanta")
        .update({ current: participant.current, past: participant.past })
        .eq("id", participant.id);
      if (error) {
        console.error("Error updating participant:", error.message);
      }
    });

    setParticipants(updatedParticipants);
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
      setReceiver(receiverName);

      localStorage.setItem("secretSantaSelected", "true");

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
        <div
          className="select-wrapper"
        >
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