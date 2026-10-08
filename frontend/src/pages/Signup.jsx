import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";
import AuthLayout, { AuthField, AuthError, AuthSubmit } from "../components/AuthLayout";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start reviewing code and practicing interviews with DevMind"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-400 transition hover:text-indigo-300 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      {error && <AuthError message={error} />}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          id="name"
          label="Name"
          icon="user"
          placeholder="Your name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <AuthField
          id="email"
          label="Email"
          type="email"
          icon="mail"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          icon="lock"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <AuthSubmit loading={loading} loadingText="Creating account...">
          Sign Up →
        </AuthSubmit>
      </form>
    </AuthLayout>
  );
}

export default Signup;