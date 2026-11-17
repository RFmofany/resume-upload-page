import { useRef, useState } from 'react'
import illustration from '../resume-illustration.png'
import './styles.css'

const ACCEPTED = '.pdf,.doc,.docx'

function CloudIcon() {
  return (
    <svg className="cloud-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M18.4 47.2h29.1c6.1 0 11-4.7 11-10.5 0-5.6-4.4-10.1-10-10.5C47 19.4 41.3 15 34.7 15c-8 0-14.5 6.1-15 13.9-4.8.6-8.5 4.5-8.5 9.2 0 5.1 3.2 9.1 7.2 9.1Z"
        stroke="#2F6BFF"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path d="M32 44V28m0 0-6.5 6.4M32 28l6.5 6.4" stroke="#2F6BFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 10.2 8.6 13.8 15 7.2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UploadZone({ onFiles }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const openPicker = () => inputRef.current?.click()

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    onFiles(event.dataTransfer.files)
  }

  return (
    <div
      className={`dropzone${dragging ? ' is-dragging' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Upload your resume"
      onClick={openPicker}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openPicker()
        }
      }}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        hidden
        onChange={(event) => {
          onFiles(event.target.files)
          event.target.value = ''
        }}
      />
      <CloudIcon />
      <p className="dropzone-text">
        Drag your resume file to this area, or click on the area to select{' '}
        <br />
        the appropriate file to upload
      </p>
    </div>
  )
}

function Stepper({ finished }) {
  return (
    <div className="stepper" aria-label="Step 3 of 3">
      <span className="step done"><CheckIcon /></span>
      <span className="step done"><CheckIcon /></span>
      <span className={`step current${finished ? ' done' : ''}`}>
        {finished ? <CheckIcon /> : '3'}
      </span>
    </div>
  )
}

export default function App() {
  const [files, setFiles] = useState([])
  const [message, setMessage] = useState('')
  const [finished, setFinished] = useState(false)

  const addFiles = (fileList) => {
    const next = Array.from(fileList).filter((file) =>
      /\.(pdf|doc|docx)$/i.test(file.name)
    )
    if (!next.length) {
      setMessage('Please choose a PDF, DOC or DOCX file.')
      return
    }
    setFiles((current) => [...current, ...next])
    setMessage('')
    setFinished(false)
  }

  const handleFinish = () => {
    if (!files.length) {
      setMessage('Choose a resume file first.')
      return
    }
    setFinished(true)
    setMessage('Resume uploaded. You can finish the application now.')
  }

  const handleBack = () => {
    setFiles([])
    setFinished(false)
    setMessage('')
  }

  return (
    <main className="page">
      <section className="intro">
        <h1>
          Finish!
          <br />
          Upload Your Resume
        </h1>
        <p className="subtitle">
          Upload your resume, the platform will help you parse and optimize, you
          can also skip this step
        </p>

        {files.length > 0 && (
          <div className="count-badge" aria-label={`${files.length} file selected`}>
            <span className="count-number">{files.length}</span>
            <span className="count-unit">条</span>
          </div>
        )}

        <img className="illustration" src={illustration} alt="" />
      </section>

      <section className="card">
        <h2>Upload file</h2>

        <UploadZone onFiles={addFiles} />

        {files.length > 0 && (
          <ul className="file-list">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`}>
                <span className="file-name" title={file.name}>{file.name}</span>
                <button
                  type="button"
                  className="remove"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => {
                    setFiles((current) => current.filter((_, i) => i !== index))
                    setFinished(false)
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {message && <p className={`message${finished ? ' success' : ''}`}>{message}</p>}

        <div className="button-row">
          <button type="button" className="btn secondary" onClick={handleBack}>
            Last step
          </button>
          <button type="button" className="btn primary" onClick={handleFinish}>
            Finish
          </button>
        </div>

        <Stepper finished={finished} />
      </section>
    </main>
  )
}
