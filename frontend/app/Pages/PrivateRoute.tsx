
function PrivateRoute() {
  const isAuthenticated = false; // Replace with your authentication logic

  return isAuthenticated ? (
    <div>PrivateRoute</div>
  ) : (
    <div>You are not authorized to view this page.</div>
  );
}

export default PrivateRoute