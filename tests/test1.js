function userCard() {
  //function would be replaced by "component"
  <div style={styles.card}>
    <img src={userCard.avatar} alt={userCard.name} />
    <h2>{userCard.name}</h2>
    <p>{userCard.email}</p>
    <button style={styles.button}>View Profile</button>
  </div>;

  const styles = {
    border: "2px solid purple"
  };
}
/*
<htmlTag>this is a script {
  for (let i = 0 ; i < 10 ; i++){
    print `\nline ${i}`;
  }
}</htmlTag>
*/

<userCard name="Alice" email="alice@example.com" avatar="/avatar.png" />;
((BEGIN))
const alfa = 45.5;
((END))