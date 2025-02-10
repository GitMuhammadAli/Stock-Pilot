import { Button, TextField, Container, Typography } from "@mui/material";

export default function Login() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <TextField label="Email" fullWidth margin="normal" />
      <TextField label="Password" type="password" fullWidth margin="normal" />
      <Button variant="contained" fullWidth>Sign In</Button>
    </Container>
  );
}