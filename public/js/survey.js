const form = document.getElementById("survey");

form.addEventListener("submit", (event) => {
  const requiredQuestions = [
    "age",
    "vacation-climate",
    "vacation-budget",
    "vacation-style",
    "vacation-scenery",
    "vacation-cuisine",
    "cuisine-type",
    "transportation-mode",
    "water-activities",
    "winter-activities",
    "duration",
    "outdoor-activities",
    "nightlife-type",
    "transportation",
    "itinerary",
    "street-food",
    "coffee-culture",
    "city-rural",
  ];

  let unansweredQuestions = [];

  requiredQuestions.forEach((question) => {
    const answer = form.elements[question].value;
    console.log(answer)
    if (!answer) {
      unansweredQuestions.push(question);
    }
  });

  if (unansweredQuestions.length > 0) {
    console.log("unanswer")
    event.preventDefault();
    alert(`Please answer the following questions: ${unansweredQuestions.join(", ")}`);
    form.elements[unansweredQuestions[0]].focus();
  }
});
