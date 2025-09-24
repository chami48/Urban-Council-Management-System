// src/Components/PlaygroundForm/pUser.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PUser({ booking, onDelete }) {
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
    status, // Use the actual status field from backend
    comment,
    createdAt
  } = booking || {};

  const displayStatus = status || "Pending";

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "—";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Event Header */}
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {eventName || "Untitled Event"}
            </h3>
            <p className="text-sm font-medium text-gray-600">{eventType}</p>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Organizer:</span> {organizerName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Contact:</span> {email}
              </p>
              {phone && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {phone}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Playground:</span>{" "}
                {playgroundType}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Attendees:</span>{" "}
                {expectedAttendees}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date:</span>{" "}
                {formatDate(eventDate)}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="mb-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Time:</span> {startTime} - {endTime}
            </p>
          </div>

          {/* Description */}
          {description && (
            <div className="mb-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Description:</span> {description}
              </p>
            </div>
          )}

          {/* Special Requirements */}
          {specialRequirement && (
            <div className="mb-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Special Requirements:</span>{" "}
                {specialRequirement}
              </p>
            </div>
          )}

          {/* Status and Comment */}
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(
                displayStatus
              )}`}
            >
              {displayStatus}
            </span>
            {createdAt && (
              <span className="text-xs text-gray-500">
                Created: {formatDate(createdAt)}
              </span>
            )}
          </div>

          {/* Admin Comment */}
          {comment && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Admin Comment:
              </p>
              <p className="text-sm text-gray-600">{comment}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 ml-4">
          <Link
            to={`/userdetails/${_id}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Update
          </Link>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            title="Delete booking"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
