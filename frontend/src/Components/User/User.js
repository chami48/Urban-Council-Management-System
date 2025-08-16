function User(props) {
  const {
    _id,
    eventName,
    eventType,
    description,
    organizerName,
    email,
    phone,
    playgroundType,
    expectedAttendees,
    eventDate,
    startTime,
    endTime,
    specialRequirement,
    approve,   // <-- add this
    reject,    // <-- add this
    comment
  } = props.user;

  // Derive status text and color from approve and reject booleans
  const getStatus = () => {
    if (approve) return { text: "Approved", color: "#28a745" };
    if (reject) return { text: "Rejected", color: "#dc3545" };
    return { text: "Pending", color: "#ffc107" };
  };

  const { text: statusText, color: statusColor } = getStatus();

  // rest of your code remains the same, but replace usage of `status` with `statusText` and `statusColor`

  return (
    <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px" }}>
      <h2 style={{ marginBottom: "10px" }}>Event Display</h2>
      <p><strong>ID:</strong> {_id}</p>
      <p><strong>Event Name:</strong> {eventName}</p>
      <p><strong>Event Type:</strong> {eventType}</p>
      <p><strong>Description:</strong> {description}</p>
      <p><strong>Organizer:</strong> {organizerName}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Phone:</strong> {phone}</p>
      <p><strong>Playground Type:</strong> {playgroundType}</p>
      <p><strong>Expected Attendees:</strong> {expectedAttendees}</p>
      <p><strong>Event Date:</strong> {new Date(eventDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {startTime} - {endTime}</p>
      <p><strong>Special Requirements:</strong> {specialRequirement || "None"}</p>

      {/* Admin Approval Status */}
      <p>
        <strong>Status:</strong>{' '}
        <span style={{
          backgroundColor: statusColor,
          color: "#fff",
          padding: "5px 12px",
          borderRadius: "20px",
          fontWeight: "bold",
          textTransform: "capitalize"
        }}>
          {statusText}
        </span>
      </p>

      {/* Admin Comment (if available) */}
      {comment && (
        <p><strong>Admin Comment:</strong> {comment}</p>
      )}

      {/* Your existing Update and Delete buttons */}
      {/* ... */}
    </div>
  );
}

export default User;
