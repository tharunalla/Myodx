
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { DeleteUser, GetUsersDetail, PostEditedData, FetchUserReport } from "../api/AdminDataFetch.js";
import { Modal, Button, Form } from "react-bootstrap";
import ProfileModal from "./ProfileModal.jsx";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;



const PageWrapper = styled.div`
  padding: 10px;
  background-color: #f0f8ff;
  margin-top: 0px;  // This margin ensures that the content starts below the navbar
  // min-height: 40vh;  // Ensure it covers full height if needed
  overflow-y: auto;   // Enable scrolling if content exceeds the screen height
`;

// Container
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 123, 255, 0.2);
  animation: ${fadeIn} 0.8s ease;
`;

// Title
const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #007bff;
  text-align: center;
  margin-bottom: 30px;
`;

// Table Container to allow horizontal scrolling on small screens
const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

// Table Styles
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
`;

const TableHeader = styled.th`
  background-color: #007bff;
  color: white;
  padding: 15px;
  text-align: left;
  font-size: 16px;
`;

const TableRow = styled.tr`
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #e6f2ff;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
  color: #333;
  font-size: 15px;
`;

// Action Buttons
const ActionButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  margin-right: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
  }

  &:active {
    transform: translateY(0px);
    box-shadow: none;
  }

  &:disabled {
    background: grey;
    cursor: not-allowed;
  }
`;

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [Deleting, setDeleting] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfileReport, setUserProfileReport] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    age: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await GetUsersDetail();
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users!", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000); // refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age || "",
    });
    setModalIsOpen(true);
  };

  const handleDeleteClick = async (user) => {
    setDeleting(true);
    try {
      await DeleteUser({ userId: user._id });
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleViewProfile = async (user) => {
    try {
      const response = await FetchUserReport({ userId: user._id });
      setUserProfileReport(response.data.report);
      setShowProfileModal(true);
    } catch (error) {
      console.error("Error fetching user report:", error);
    }
  };

  const handleCloseModal = () => {
    setShowProfileModal(false);
    setUserProfileReport(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await PostEditedData({ userId: currentUser._id, formData });
      setModalIsOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <PageWrapper>
      <Container>
        <Title>User Dashboard</Title>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <ActionButton onClick={() => handleEditClick(user)}>
                      Edit
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleDeleteClick(user)}
                      disabled={Deleting}
                    >
                      {Deleting ? "Deleting..." : "Delete"}
                    </ActionButton>
                    <ActionButton onClick={() => handleViewProfile(user)}>
                      View Profile
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>

        {/* Profile Modal */}
        <ProfileModal
          showProfileModal={showProfileModal}
          handleClose={handleCloseModal}
          userProfileReport={userProfileReport}
        />

        {/* Edit Modal */}
        <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {currentUser && (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formRole" className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formAge" className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button variant="secondary" onClick={() => setModalIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="ms-3">
                    Save Changes
                  </Button>
                </div>
              </Form>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </PageWrapper>
  );
};

export default UserPage;















































