import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Row, Col, Form, Button, Spinner, Alert, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchItemById, createItem, updateItem, clearItemErrors, selectItemsState } from '../../store/itemsSlice'
import ItemImage from './ItemImage'
import { CATEGORIES } from './categories'
import "./Items.css"

const emptyForm = {
  name: "",
  category: "",
  unit: "",
  price: "",
  quantity: "",
  image: "",
  description: ""
};

const toFormData = (item)=>({
  name: item.name,
  category: item.category,
  unit: item.unit || "",
  price: item.price ?? "",
  quantity: item.quantity ?? "",
  image: item.image || "",
  description: item.description || ""
});

// Used for both creating (/items/new) and editing (/items/:id/edit)
export default function ItemForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saving, saveError, currentError } = useSelector(selectItemsState);
  // The form inputs are local UI state; the saved item lives in the store
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const error = saveError || (isEdit ? currentError : null);

  useEffect(()=>{
    dispatch(clearItemErrors());
    if(!isEdit) return;
    let ignore = false;
    setLoading(true);
    dispatch(fetchItemById(id)).unwrap()
      .then((item)=>{ if(!ignore) setFormData(toFormData(item)); })
      .catch(()=>{ /* currentError in the store is shown */ })
      .finally(()=>{ if(!ignore) setLoading(false); });
    return ()=>{ ignore = true; };
  },[dispatch, id, isEdit]);

  const handleInputChange=(event)=>{
    const{name,value}=event.target;
    setFormData({
      ...formData,
      [name]:value
    })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const data = {
      ...formData,
      price: Number(formData.price) || 0,
      quantity: Number(formData.quantity) || 0
    };
    try{
      const item = await dispatch(isEdit ? updateItem({ id, data }) : createItem(data)).unwrap();
      navigate(`/items/${item._id}`);
    }catch{
      // saveError in the store is shown above the form
    }
  }

  if(loading){
    return <div className="text-center py-5"><Spinner animation="border" /></div>;
  }

  return (
    <Container className="page">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-3 p-md-4">
              <h1 className="h3 mb-4">{isEdit ? "Edit Item" : "Add Item"}</h1>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="itemName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control name="name" value={formData.name} onChange={handleInputChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="itemCategory">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        name="category"
                        list="category-options"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Pick or type a category"
                        required
                        />
                      <datalist id="category-options">
                        {CATEGORIES.map((c)=><option key={c} value={c} />)}
                      </datalist>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="itemUnit">
                      <Form.Label>Unit</Form.Label>
                      <Form.Control name="unit" value={formData.unit} onChange={handleInputChange} placeholder="e.g. 1 kg" />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="itemPrice">
                      <Form.Label>Price (Rs.)</Form.Label>
                      <Form.Control type="number" min="0" step="any" name="price" value={formData.price} onChange={handleInputChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="itemQuantity">
                      <Form.Label>Quantity in stock</Form.Label>
                      <Form.Control type="number" min="0" step="1" name="quantity" value={formData.quantity} onChange={handleInputChange} required />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="itemImage">
                      <Form.Label>Image URL</Form.Label>
                      <Form.Control type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://... (leave empty for a placeholder)" />
                    </Form.Group>
                    <ItemImage key={formData.image} src={formData.image} name={formData.name} className="item-form-preview mt-2" />
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="itemDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-grid d-sm-flex gap-2 mt-4">
                  <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Item"}
                  </Button>
                  <Button variant="outline-secondary" onClick={()=>navigate(-1)} disabled={saving}>Cancel</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
