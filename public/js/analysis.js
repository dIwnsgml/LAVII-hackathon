const analysisbtn = document.querySelector("#getanalysis");
analysisbtn.addEventListener('click', () => {
  (async () => {
    const response = await fetch(`/analysis`, {method: 'POST'});
    const analysis = await response.json();
    console.log(analysis)
  })();
})