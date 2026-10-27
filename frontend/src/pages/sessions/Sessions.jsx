import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, ListGroup, Button, Badge, Spinner, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { fetchSessions, revokeSession, revokeOtherSessions, clearSessionsError, selectSessionsState } from '../../store/sessionsSlice';

// Turns a user-agent string into something like "Chrome on Windows"
function describeDevice(userAgent = "") {
  const browser =
    /Edg\//.test(userAgent) ? "Edge" :
    /OPR\/|Opera/.test(userAgent) ? "Opera" :
    /Firefox\//.test(userAgent) ? "Firefox" :
    /Chrome\//.test(userAgent) ? "Chrome" :
    /Safari\//.test(userAgent) ? "Safari" :
    "Unknown browser";
  const os =
    /Windows/.test(userAgent) ? "Windows" :
    /Android/.test(userAgent) ? "Android" :
    /iPhone|iPad|iPod/.test(userAgent) ? "iOS" :
    /Mac OS X/.test(userAgent) ? "macOS" :
    /Linux/.test(userAgent) ? "Linux" :
    "unknown OS";
  return `${browser} on ${os}`;
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}

export default function Sessions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, status, error } = useSelector(selectSessionsState);
  const loading = status === "idle" || status === "loading";
  const others = list.filter((session) => !session.current).length;

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  const handleRevoke = async (session) => {
    const message = session.current
      ? "Log out of this device?"
      : `Log out "${describeDevice(session.userAgent)}"?`;
    if (!window.confirm(message)) return;
    try {
      const result = await dispatch(revokeSession(session.id)).unwrap();
      if (result.current) {
        dispatch(logout());
        navigate("/login");
      }
    } catch {
      // error in the store is shown above the list
    }
  }

  const handleRevokeOthers = async () => {
    if (!window.confirm("Log out of all other devices?")) return;
    dispatch(revokeOtherSessions());
  }

  return (
    <Container className="page" style={{ maxWidth: 760 }}>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <div>
          <h1 className="h3 mb-0">Active sessions</h1>
          <small className="text-muted">Devices where you are logged in</small>
        </div>
        <Button variant="outline-danger" disabled={others === 0} onClick={handleRevokeOthers}>
          Log out other devices
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => dispatch(clearSessionsError())} dismissible>{error}</Alert>}

      {loading && list.length === 0 ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : list.length === 0 ? (
        <p className="text-center text-muted py-5">No active sessions.</p>
      ) : (
        <ListGroup>
          {list.map((session) => (
            <ListGroup.Item key={session.id} className="d-flex flex-column flex-sm-row gap-2 align-items-sm-center">
              <div className="me-auto">
                <div className="fw-semibold">
                  {describeDevice(session.userAgent)}
                  {session.current && <Badge bg="success" className="ms-2">This device</Badge>}
                </div>
                <small className="text-muted d-block">
                  {session.ip && `IP ${session.ip} · `}Last active {formatDate(session.lastUsedAt)}
                </small>
                <small className="text-muted d-block">Signed in {formatDate(session.createdAt)}</small>
              </div>
              <Button size="sm" variant="outline-danger" onClick={() => handleRevoke(session)}>
                {session.current ? "Log out" : "Revoke"}
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  )
}
