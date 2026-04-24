import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../api/mutations';
import { NavigationGuard } from '@shared/components/NavigationGuard';
import { logger } from '@utils/logger';

const FIELDS = [
  { name: 'fullName',  label: 'Full Name',       placeholder: 'Jane Smith',          col: 2 },
  { name: 'email',     label: 'Email',            placeholder: 'jane@example.com',    col: 2 },
  { name: 'address',   label: 'Street Address',   placeholder: '123 Main St',         col: 2 },
  { name: 'city',      label: 'City',             placeholder: 'New York',            col: 1 },
  { name: 'zip',       label: 'ZIP / Postal',     placeholder: '10001',               col: 1 },
  { name: 'country',   label: 'Country',          placeholder: 'United States',       col: 2 },
];

const EMPTY = Object.fromEntries(FIELDS.map((f) => [f.name, '']));

function validate(form) {
  const errors = {};
  if (!form.fullName.trim())              errors.fullName = 'Required';
  if (!/\S+@\S+\.\S+/.test(form.email))  errors.email    = 'Valid email required';
  if (!form.address.trim())              errors.address  = 'Required';
  if (!form.city.trim())                 errors.city     = 'Required';
  if (!form.zip.trim())                  errors.zip      = 'Required';
  if (!form.country.trim())              errors.country  = 'Required';
  return errors;
}

export default function CheckoutModal({ items, total, onClose }) {
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [step, setStep]       = useState('form'); // 'form' | 'success'
  const checkout  = useCheckout();
  const navigate  = useNavigate();
  const isDirty   = Object.values(form).some(Boolean);

  // Log checkout_started once on mount — capture values at open time via ref
  // so the effect doesn't re-fire if items/total change while modal is open.
  const mountRef = useRef({ itemCount: items.length, totalValue: total });
  useEffect(() => {
    const { itemCount, totalValue } = mountRef.current;
    logger.info('checkout_started', { itemCount, totalValue });
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (touched[name]) setErrors((e) => ({ ...e, [name]: validate({ ...form, [name]: value })[name] }));
  };

  const blur = (name) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validate(form)[name] }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched(Object.fromEntries(FIELDS.map((f) => [f.name, true])));
      return;
    }
    checkout.mutate({ items, shipping: form }, {
      onSuccess: () => setStep('success'),
    });
  };

  const goToOrders = () => { onClose(); navigate('/orders'); };

  return (
    <>
     
      <NavigationGuard isDirty={isDirty && step === 'form'} />

      <div
        onClick={step === 'form' ? undefined : onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--clr-surface)', borderRadius: 'var(--radius-lg)',
            width: '100%', maxWidth: 520, maxHeight: '90svh',
            overflow: 'auto', boxShadow: 'var(--shadow-lg)',
          }}
        >
          {step === 'form' ? (
            <>
    
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--clr-border)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Checkout</h2>
                <button className="btn btn-ghost btn-sm" onClick={onClose} aria-label="Close checkout" style={{ padding: '4px 8px', fontSize: 18, lineHeight: 1 }}>✕</button>
              </div>

         
              <div style={{ padding: '16px 24px', background: 'var(--clr-bg)', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: 'var(--clr-muted)' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                <span style={{ fontWeight: 700 }}>Total: ${total.toFixed(2)}</span>
              </div>

       
              <form onSubmit={submit} noValidate style={{ padding: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--clr-muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16 }}>
                  Shipping Information
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {FIELDS.map(({ name, label, placeholder, col }) => (
                    <div key={name} style={{ gridColumn: `span ${col}` }}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 5, color: 'var(--clr-text)' }}>
                        {label}
                      </label>
                      <input
                        className="input"
                        style={errors[name] && touched[name] ? { borderColor: 'var(--clr-danger)', boxShadow: '0 0 0 3px rgba(239,68,68,.15)' } : {}}
                        placeholder={placeholder}
                        value={form[name]}
                        onChange={(e) => set(name, e.target.value)}
                        onBlur={() => blur(name)}
                      />
                      {errors[name] && touched[name] && (
                        <p style={{ fontSize: 12, color: 'var(--clr-danger)', marginTop: 4 }}>{errors[name]}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
                  <button type="button" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '13px' }} disabled={checkout.isPending}>
                    {checkout.isPending ? 'Placing order…' : 'Place Order'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Success screen */
            <div style={{ padding: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                ✓
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>Order Placed!</h2>
              <p style={{ color: 'var(--clr-muted)', fontSize: 15, maxWidth: 320 }}>
                Thanks, <strong>{form.fullName}</strong>! Your order has been received and is being processed.
              </p>
              <p style={{ fontSize: 13, color: 'var(--clr-muted)' }}>
                Confirmation will be sent to <strong>{form.email}</strong>
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 8, width: '100%' }}>
                <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
                  Continue Shopping
                </button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={goToOrders}>
                  View Orders
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
