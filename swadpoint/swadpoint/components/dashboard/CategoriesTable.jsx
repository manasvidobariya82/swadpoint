const categories = [
  { id: 1, name: "Breakfast", desc: "Breakfast category description" },
  { id: 2, name: "Appetizers", desc: "Appetizers category description" },
  { id: 3, name: "Salads", desc: "Salads category description" },
  { id: 4, name: "Soups", desc: "Soups category description" },
  { id: 5, name: "Meat Courses", desc: "Meat Courses category description" },
];

export default function CategoriesTable() {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Edit</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat) => (
          <tr key={cat.id}>
            <td>{cat.id}</td>
            <td>{cat.name}</td>
            <td>{cat.desc}</td>
            <td>✏️</td>
            <td>🗑️</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
