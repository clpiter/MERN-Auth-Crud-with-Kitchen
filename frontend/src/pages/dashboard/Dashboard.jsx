import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Badge, Pagination, Spinner, Alert, InputGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';
import { fetchItems, deleteItem, clearItemErrors, selectItemsState } from '../../store/itemsSlice';
import ItemImage from '../items/ItemImage';
import { formatPrice } from '../items/categories';
import "../items/Items.css";

const PAGE_SIZE = 12;

export default function Dashboard() {

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { list: data, listStatus, listError, deleteError } = useSelector(selectItemsState);
  const loading = listStatus === "idle" || listStatus === "loading";
  const error = listError || deleteError;

  // Filters live in the URL so they survive refresh and can be linked from the menu
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(search);
  const [reload, setReload] = useState(0);

  // Keep the search box in sync when the URL changes (e.g. from the menu)
  useEffect(()=>{
    setSearchInput((prev)=>prev.trim() === search ? prev : search);
  },[search]);

  // Live search: update the URL shortly after the user stops typing
  useEffect(()=>{
    const timer = setTimeout(()=>{
      const value = searchInput.trim();
      setSearchParams((prev)=>{
        if((prev.get("search") || "") === value) return prev;
        const next = new URLSearchParams(prev);
        if(value) next.set("search", value);
        else next.delete("search");
        next.delete("page");
        return next;
      }, { replace: true });
    }, 300);
    return ()=>clearTimeout(timer);
  },[searchInput, setSearchParams]);

  useEffect(()=>{
    dispatch(fetchItems({ search, category, page, limit: PAGE_SIZE }));
  },[dispatch, search, category, page, reload]);

  const updateParams = (next)=>{
    const params = { search, category, page, ...next };
    const cleaned = {};
    Object.entries(params).forEach(([key, value])=>{
      if(value && !(key === "page" && Number(value) === 1)) cleaned[key] = String(value);
    });
    setSearchParams(cleaned);
  }

  // Search runs as you type; Enter just shouldn't reload the page
  const handleSearch = (e)=>{
    e.preventDefault();
  }

  const handleDelete = async (item)=>{
    if(!window.confirm(`Delete "${item.name}"?`)) return;
    try{
      await dispatch(deleteItem(item._id)).unwrap();
      // Step back a page if the last item on this page was removed, otherwise refill the page
      if(data.items.length === 1 && page > 1) updateParams({ page: page - 1 });
      else setReload((r)=>r + 1);
    }catch{
      // deleteError in the store is shown above the list
    }
  }

  const firstPage = Math.max(1, page - 2);
  const lastPage = Math.min(data.pages, page + 2);
  const pageNumbers = [];
  for(let i = firstPage; i <= lastPage; i++) pageNumbers.push(i);

  return (
    <Container className="page">
      {user && <p className="fs-5 mb-1">Hi, <strong>{user.name}</strong> 👋</p>}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <div>
          <h1 className="h3 mb-0">Kitchen Daily Needs</h1>
          <small className="text-muted">
            {data.total} items{category && ` in ${category}`}
          </small>
        </div>
        <Button as={Link} to="/items/new" variant="success">+ Add Item</Button>
      </div>

      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="g-2">
          <Col md={7}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search items..."
                value={searchInput}
                onChange={(e)=>setSearchInput(e.target.value)}
                aria-label="Search items"
                />
              {searchInput && (
                <Button variant="outline-secondary" onClick={()=>setSearchInput("")} aria-label="Clear search">
                  &times;
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col md={5}>
            <Form.Select
              value={category}
              onChange={(e)=>updateParams({ category: e.target.value, page: 1 })}
              aria-label="Filter by category"
              >
              <option value="">All categories</option>
              {data.categories.map((c)=><option key={c} value={c}>{c}</option>)}
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger" onClose={()=>dispatch(clearItemErrors())} dismissible>{error}</Alert>}

      {/* Full spinner only on first load; afterwards keep the grid and dim it while searching */}
      {loading && data.items.length === 0 ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : data.items.length === 0 ? (
        <p className="text-center text-muted py-5">No items found.</p>
      ) : (
        <Row xs={1} sm={2} md={3} xl={4} className="g-3 g-md-4" style={{ opacity: loading ? 0.5 : 1 }}>
          {data.items.map((item)=>(
            <Col key={item._id}>
              <Card className="h-100 item-card">
                <Link to={`/items/${item._id}`}>
                  <ItemImage src={item.image} name={item.name} className="card-img-top item-card-img" />
                </Link>
                <Card.Body>
                  <Badge bg="secondary" className="mb-2">{item.category}</Badge>
                  <Card.Title className="h6">
                    <Link to={`/items/${item._id}`}>{item.name}</Link>
                  </Card.Title>
                  <Card.Text className="mb-0">
                    <strong>{formatPrice(item.price)}</strong>
                    {item.unit && <span className="text-muted"> / {item.unit}</span>}
                  </Card.Text>
                  <small className={item.quantity > 0 ? "text-success" : "text-danger"}>
                    {item.quantity > 0 ? `${item.quantity} in stock` : "Out of stock"}
                  </small>
                </Card.Body>
                <Card.Footer className="bg-white d-flex gap-2">
                  <Button as={Link} to={`/items/${item._id}`} size="sm" variant="outline-primary">View</Button>
                  <Button as={Link} to={`/items/${item._id}/edit`} size="sm" variant="outline-secondary">Edit</Button>
                  <Button size="sm" variant="outline-danger" className="ms-auto" onClick={()=>handleDelete(item)}>Delete</Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {data.pages > 1 && (
        <Pagination className="justify-content-center flex-wrap mt-4">
          <Pagination.First disabled={page === 1} onClick={()=>updateParams({ page: 1 })} />
          <Pagination.Prev disabled={page === 1} onClick={()=>updateParams({ page: page - 1 })} />
          {pageNumbers.map((n)=>(
            <Pagination.Item key={n} active={n === page} onClick={()=>updateParams({ page: n })}>{n}</Pagination.Item>
          ))}
          <Pagination.Next disabled={page === data.pages} onClick={()=>updateParams({ page: page + 1 })} />
          <Pagination.Last disabled={page === data.pages} onClick={()=>updateParams({ page: data.pages })} />
        </Pagination>
      )}
    </Container>
  )
}
