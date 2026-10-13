import React from 'react';

/**
 * Класовий компонент Content (class Content extends React.Component)
 * Реалізує зміну кольору елементів при кліку
 */
class Content extends React.Component {
  constructor(props) {
    super(props);

    // Палітри кольорів (фон та текст з високим контрастом)
    this.nameStyles = [
      { bg: "transparent", color: "#212529" },
      { bg: "#d32f2f", color: "#ffffff" },
      { bg: "#198754", color: "#ffffff" },
      { bg: "#0d6efd", color: "#ffffff" },
      { bg: "#6f42c1", color: "#ffffff" }
    ];

    this.emailStyles = [
      { bg: "transparent", color: "#6c757d" },
      { bg: "#ffc107", color: "#212529" },
      { bg: "#20c997", color: "#ffffff" },
      { bg: "#fd7e14", color: "#ffffff" },
      { bg: "#0dcaf0", color: "#212529" }
    ];

    this.state = {
      nameIndex: 0,
      emailIndex: 0,
      name: props.name || "Бондаренко Ілля Олександрович",
      email: props.email || "student@kpi.ua"
    };

    this.handleNameClick = this.handleNameClick.bind(this);
    this.handleEmailClick = this.handleEmailClick.bind(this);
  }

  handleNameClick() {
    this.setState((prevState) => ({
      nameIndex: (prevState.nameIndex + 1) % this.nameStyles.length
    }));
  }

  handleEmailClick() {
    this.setState((prevState) => ({
      emailIndex: (prevState.emailIndex + 1) % this.emailStyles.length
    }));
  }

  render() {
    const nameStyle = this.nameStyles[this.state.nameIndex];
    const emailStyle = this.emailStyles[this.state.emailIndex];

    return (
      <div className="profile-content text-center mt-3">
        {/* Елемент 1 (ПІБ) - зміна кольорів при кліку */}
        <h4
          id="profile-name"
          onClick={this.handleNameClick}
          style={{
            backgroundColor: nameStyle.bg,
            color: nameStyle.color,
            cursor: "pointer",
            userSelect: "none",
            transition: "all 0.3s ease",
            padding: "8px 14px",
            borderRadius: "10px",
            display: "inline-block",
            maxWidth: "100%"
          }}
          title="Клікніть для зміни кольору (React: this.setState)"
        >
          {this.state.name}
        </h4>

        {/* Елемент 2 (Email) - зміна кольорів при кліку */}
        <div>
          <p
            id="profile-email"
            onClick={this.handleEmailClick}
            style={{
              backgroundColor: emailStyle.bg,
              color: emailStyle.color,
              cursor: "pointer",
              userSelect: "none",
              transition: "all 0.3s ease",
              padding: "5px 12px",
              borderRadius: "8px",
              display: "inline-block",
              marginBottom: "0.5rem"
            }}
            title="Клікніть для зміни кольору (React: this.setState)"
          >
            {this.state.email}
          </p>
        </div>

        <div className="text-muted small mt-2">
          <i className="bi bi-cursor-fill me-1 text-danger"></i>
          <span style={{ fontSize: "0.78rem" }}>
            Клікніть по імені або email для зміни стилю (React Class Component)
          </span>
        </div>
      </div>
    );
  }
}

export default Content;

