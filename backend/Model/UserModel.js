const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  eventName: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  organizerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  playgroundType: {
    type: String,
    required: true
  },
  expectedAttendees: {
    type: Number,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  specialRequirement: {
    type: String,
    required: false 
  },
  approve: {
    type: Boolean,
    default: false
},
reject: {
    type: Boolean,
    default: false
},
comment: {
    type: String,
    default: ''
},
statusUpdatedAt: {
    type: Date
}

});

module.exports = mongoose.model("User", userSchema);
