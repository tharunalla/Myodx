






import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {forgotpassword} from '../api/index';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [sumit,setSumit] = useState(false);
    const handleSubmit = async(e)=>{
        setSumit(true);
        e.preventDefault();
        if (!email) {
            setSumit(false);
            // alert("Please fill the email already logged in ");
            window.Toastify({ text: "⚠️ Please fill the email already logged in", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(255, 193, 7, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

            return false;
        }
        try {
            const response = await forgotpassword({ email });
            console.log("Response received: ", response); // Log the response to the console
    
            // Optionally, you can display the response to the user
            // alert(`Password reset link sent to ${email}`);
            window.Toastify({ text: `✅ Password reset link sent to ${email}`, duration: 4000, gravity: "top", position: "center", style: { background: "rgba(40, 167, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

            navigate("/", { state: { showUserSignUp: true } }); 
        } catch (error) {
            console.error("Error occurred: ", error);
    
            // Handle 404 error
            if (error.response && error.response.status === 404) {
                // alert("User not found. Redirecting to sign-up page.");
                window.Toastify({ text: "❌ User not found. Redirecting to sign-up page.", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

                navigate("/", { state: { showUserSignUp: true } }); // Navigate to '/' and show user sign-up page
            } else {
                // alert("Something went wrong. Please try again later.");
                window.Toastify({ text: "❌ Something went wrong. Please try again later.", duration: 4000, gravity: "top", position: "center", style: { background: "rgba(220, 53, 69, 0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", color: "#fff", fontWeight: "500", fontSize: "16px", padding: "14px 28px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.2)", textAlign: "center" }, close: true, stopOnFocus: true }).showToast();

            }
        }
        setSumit(false);
    }


    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    };

    const formStyle = {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px', // Makes it responsive
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginTop: '8px',
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxSizing: 'border-box',
    };

    const buttonStyle = {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const labelStyle = {
        fontWeight: 'bold',
    };

    return (
        <div style={containerStyle}>
            <form style={formStyle} onSubmit={handleSubmit}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</h2>
                <div>
                    <label style={labelStyle} htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value = {email}
                        onChange ={(e)=>setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>
                {/* <button type="submit" style={buttonStyle}>Submit</button> */}
                <button type="submit" style={buttonStyle} disabled={sumit}>
    { sumit ? "Submitting..." : "Submit"}
  </button>
            </form>
        </div>
    );
}

export default ForgotPassword;

