function userCard() {
  //function 'would' be `replaced` by "component"
  <div style={styles.card}>
    <img src={userCard.avatar} alt={userCard.name} />
    <h2>{userCard.name}</h2>
    <p>{userCard.email}</p>
    <button style={styles.button}>View Profile</button>
  </div>;

  // <p>yo</p>

  const styles = {
    border: "2px solid purple",
  };
}

(<userCard name="Alice" email="alice@example.com" avatar="/avatar.png" />)
((BEGIN))
const alfa = 1 + 4 * 2 - (1 + 1);
const beta = alfa * 2;
let charlie = beta * beta;
((END));
