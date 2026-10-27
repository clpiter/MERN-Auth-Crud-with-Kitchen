import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Col, Badge, Button, Spinner, Alert, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItemById, deleteItem, clearItemErrors, selectItemsState } from '../../store/itemsSlice'
import ItemImage from './ItemImage'
import { formatPrice } from './categories'
import "./Items.css"

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current, currentStatus, currentError, deleteError } = useSelector(selectItemsState);

  // Ignore a stored item that belongs to a different page
  const item = current?._id === id ? current : null;
  const loading = !item && currentStatus !== "failed";
  const error = currentError || deleteError;

  useEffect(()=>{
    dispatch(clearItemErrors());
    dispatch(fetchItemById(id));
  },[dispatch, id]);

  const handleDelete = async ()=>{
    if(!window.confirm(`Delete "${item.name}"?`)) return;
    try{
      await dispatch(deleteItem(id)).unwrap();
      navigate("/dashboard");
    }catch{
      // deleteError in the store is shown on the page
    }
  }

  if(loading){
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  return (
    <Container className="page">
      <Button variant="link" className="px-0 mb-3" onClick={()=>navigate(-1)}>&larr; Back</Button>

      {error && <Alert variant="danger">{error}</Alert>}

      {item && (
        <Row className="g-4">
          <Col md={6}>
            <ItemImage src={item.image} name={item.name} className="item-detail-img shadow-sm" />
          </Col>
          <Col md={6}>
            <Badge bg="secondary" className="mb-2">{item.category}</Badge>
            <h1 className="h2">{item.name}</h1>
            <p className="fs-4 mb-1">
              <strong>{formatPrice(item.price)}</strong>
              {item.unit && <span className="text-muted fs-6"> / {item.unit}</span>}
            </p>
            <p className={item.quantity > 0 ? "text-success" : "text-danger"}>
              {item.quantity > 0 ? `${item.quantity} in stock` : "Out of stock"}
            </p>
            {item.description && <p>{item.description}</p>}

            <Table size="sm" className="mt-3 item-detail-table">
              <tbody>
                <tr><th>Category</th><td>{item.category}</td></tr>
                <tr><th>Unit</th><td>{item.unit || "-"}</td></tr>
                <tr><th>Price</th><td>{formatPrice(item.price)}</td></tr>
                <tr><th>Quantity</th><td>{item.quantity}</td></tr>
                <tr><th>Added</th><td>{new Date(item.createdAt).toLocaleString()}</td></tr>
                <tr><th>Last updated</th><td>{new Date(item.updatedAt).toLocaleString()}</td></tr>
              </tbody>
            </Table>

            <div className="d-grid d-sm-flex gap-2">
              <Button as={Link} to={`/items/${item._id}/edit`} variant="primary">Edit</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  )
}
