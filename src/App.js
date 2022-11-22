import { useEffect, useState } from "react";
import "./App.css";
import supabase from "./config/supabaseClient";

function App() {
  var people = [
    {
      id: 0,
      name: "Kasia",
      partner: "Agnieszka",
      current: "",
      past: "Dagmara",
    },
    { id: 1, name: "Agnieszka", partner: "Kasia", current: "", past: "Michał" },
    { id: 2, name: "Michał", partner: "", current: "", past: "Kamila" },
    { id: 3, name: "Kamila", partner: "Dagmara", current: "", past: "Tomek" },
    { id: 4, name: "Dagmara", partner: "Kamila", current: "", past: "Dagusia" },
    { id: 5, name: "Tomek", partner: "Dagusia", current: "", past: "Kasia" },
    {
      id: 6,
      name: "Dagusia",
      partner: "Tomek",
      current: "",
      past: "Agnieszka",
    },
  ];

  const [fetchError, setFetchError] = useState(null);
  const [users, setUsers] = useState(null);
  const [nameSelected, setNameSelected] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("secretSanta").select();

      if (error) {
        setFetchError("Cound not fetch users for secret santa game");
        setUsers(null);
        console.log(error);
      }

      if (data) {
        setUsers(data);
        setFetchError(null);
      }
    };

    fetchUsers();
  }, []);

  const setCurrentToBlank = (people) =>
    people.forEach((person) => (person.current = ""));
  const verifyGiftPartners = (people) =>
    people.every((person) => person.current);

  var shuffle = function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  };

  var assignGiftPartners = function (people) {
    var peopleLeftToAssign = people.map((person) => person.name);

    people.forEach(function (person) {
      var choices = peopleLeftToAssign.filter(function (personToAssign) {
        return (
          personToAssign !== person.name &&
          personToAssign !== person.partner &&
          person.past.indexOf(personToAssign) === -1
        );
      });
      shuffle(choices);
      person.current = choices[0];
      var index = peopleLeftToAssign.indexOf(choices[0]);
      peopleLeftToAssign.splice(index, 1);
    });
  };

  var allAssigned = false;
  var loopCount = 0;
  while (!allAssigned) {
    assignGiftPartners(people);
    allAssigned = verifyGiftPartners(people);

    if (loopCount > 50) {
      throw "Something went wrong with the assignment";
    }
    if (!allAssigned) {
      setCurrentToBlank(people);
    }
  }

  console.log(people);

  document.getElementById("mapped-names").innerHTML =
    `<option>Select your name...</option>` +
    people.map((person) => `<option>${person.name}</option>`).join("");

  var e = document.getElementById("mapped-names");

  const handleInsertData = async (e) => {
    await supabase.from("secretSanta").insert(people).select();
  };

  handleInsertData();

  function filterArray(text) {
    return users.filter((user) => user.name === text);
  }

  console.log("123", users);

  function onChange() {
    var text = e.options[e.selectedIndex].text;

    document.getElementById("mapped-results").innerHTML = filterArray(text).map(
      (person) => `<div>
      <p>Your name: ${person.name}</p>
      <p>You are santa to: ${person.current}</p>
      </div>`
    );
  }
  e.onchange = onChange;

  return (
    <div>
      <h1>Secret Santa game</h1>
      <select
        id="mapped-names"
        onChange={() => [onChange(), setNameSelected(true)]}
        disabled={nameSelected}
      />
      <div id="mapped-results"></div>
    </div>
  );
}

export default App;
