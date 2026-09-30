import { useEffect, useState } from 'react'
import Modal from '../../components/Modal.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import PhoneStep from './PhoneStep.jsx'
import OtpStep from './OtpStep.jsx'
import RoleStep from './RoleStep.jsx'
import SuccessStep from './SuccessStep.jsx'

export default function AuthModal() {
  const { modalOpen, closeAuthModal, completeSignup, user } = useAuth()
  const [step, setStep] = useState('phone') // phone -> otp -> role -> success
  const [phone, setPhone] = useState('')
  const [demoOtp, setDemoOtp] = useState('')
  const [finalUser, setFinalUser] = useState(null)

  // reset the flow every time the modal is reopened
  useEffect(() => {
    if (modalOpen) {
      setStep('phone')
      setPhone('')
      setFinalUser(null)
    }
  }, [modalOpen])

  function handlePhoneSubmit(digits, otp) {
    setPhone(digits)
    setDemoOtp(otp || '')
    setStep('otp')
  }

  // verifyOtp already logged existing users in, so `user` is set for them
  function handleVerified({ isNewUser }) {
    if (isNewUser) {
      setStep('role')
    } else {
      setStep('success')
    }
  }

  // throws on failure so RoleStep can show the error
  async function handleRoleComplete({ name, roles }) {
    const created = await completeSignup({ phone, name, roles })
    setFinalUser(created)
    setStep('success')
  }

  return (
    <Modal open={modalOpen} onClose={closeAuthModal} maxWidth="max-w-[420px]">
      {step === 'phone' && <PhoneStep onSubmit={handlePhoneSubmit} />}
      {step === 'otp' && (
        <OtpStep phone={phone} initialDemoOtp={demoOtp} onBack={() => setStep('phone')} onVerified={handleVerified} />
      )}
      {step === 'role' && <RoleStep onComplete={handleRoleComplete} />}
      {step === 'success' && (finalUser || user) && (
        <SuccessStep name={(finalUser || user).name} roles={(finalUser || user).roles} onClose={closeAuthModal} />
      )}
    </Modal>
  )
}
