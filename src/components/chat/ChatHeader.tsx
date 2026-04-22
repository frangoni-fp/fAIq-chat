export const ChatHeader = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className="chat-header">
      <div className="chat-header_profile-wrapper">
        <div className="chat-header_profile-img">
          <img
            src="https://cdn.prod.website-files.com/663a7abd629bfe97ec950c50/67e391743ba8b6c4bd76282e_webclip.jpg"
            alt="Profile"
          />
        </div>
        <div className="chat-header_profile-info">
          <div className="chat-header_profile-name">
            <div>Felix</div>
            <img
              src="https://cdn.prod.website-files.com/663a7abd629bfe97ec950c50/69384b1af2e155213a958918_whatsapp%20blue%20tick.png"
              loading="lazy"
              alt=""
              className="chat-header_verification-img"
            />
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: '400' }}>{isLoading ? 'Escribiendo...' : 'En línea'}</div>
        </div>
      </div>
    </div>
  )
}
