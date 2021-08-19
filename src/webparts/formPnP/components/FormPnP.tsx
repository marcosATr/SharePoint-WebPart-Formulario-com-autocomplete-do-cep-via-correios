import * as React from "react";
import styles from "./FormPnP.module.scss";
import { IFormPnPProps } from "./IFormPnPProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { HttpClient } from "@microsoft/sp-http";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/items/list";

const InvalidFields = () => {
  return <p>Por favor, insira o cep corretamente.</p>;
};

export default class FormPnP extends React.Component<IFormPnPProps, {}> {
  constructor(props: any) {
    super(props);
    this.state = { formData: {}, isCepOk: false, submitSuccess: false };
  }

  //updating formData state with current typed values.
  updateFormData(e) {
    this.setState({
      formData: {
        ...this.state["formData"],
        [e.target.name]: e.target.value,
      },
    });
    //console.log(this.state["formData"]);
  }

  //search external api for cep information
  async cepLookup() {
    const cepValue: string = this.state["formData"].cep;
    try {
      const response = await this.props.requestClient
        .get(
          `https://viacep.com.br/ws/${cepValue}/json/`,
          HttpClient.configurations.v1
        )
        .then((response) => response.json());

      console.log(response.ok, "Success");
      this.setState({
        formData: {
          ...this.state["formData"],
          bairro: response.bairro ? response.bairro : "",
          logradouro: response.logradouro || "",
          cidade: response.localidade,
          uf: response.uf,
        },
        isCepOk: true,
        submitSuccess: false,
      });

      // if (!response.ok) {
      //   this.setState({
      //     isCepOk: false,
      //   });
      // }
    } catch (error) {
      console.log(error);
      this.setState({
        isCepOk: false,
        submitSuccess: false,
      });
    }
  }

  //Called upon cep typing. !important: Needs improvement.
  fetchCepInfo(e) {
    this.cepLookup();
  }

  //onClick button, submit info:
  async saveChanges(e) {
    e.preventDefault();

    const newItem = this.state["formData"];
    await sp.web.lists.getByTitle("address").items.add(newItem);

    this.setState({
      formData: {},
      isCepOk: false,
      submitSuccess: true,
    });
  }

  public render(): React.ReactElement<IFormPnPProps> {
    const conditionOne = this.state["isCepOk"];
    const conditionTwo = Object.keys(this.state["formData"]).length == 8;
    const conditionThree = Object.values(this.state["formData"]).includes("");
    console.log(conditionThree);
    let status = conditionOne && conditionTwo && !conditionThree;
    let msg;
    this.state["submitSuccess"]
      ? (msg = "Enviado com Sucesso")
      : (msg = "Preencha todos os campos.");

    return (
      <div className={styles.formPnP}>
        <div className={styles.container}>
          <div className={styles.row}>
            <p className={styles.title}>Formulário de Cadastro.</p>
            <p className={styles.subTitle}>
              Cadastrar um novo usuário para incluir na lista.
            </p>
          </div>
          <div className={styles.row}>
            <form className={styles.mainForm}>
              <div className={styles.formRow}>
                <div className={styles.w50}>
                  <label htmlFor="Title">Nome:</label>
                  <input
                    type="text"
                    id="Title"
                    name="Title"
                    value={this.state["formData"].Title || ""}
                    onChange={(e) => {
                      this.updateFormData(e);
                    }}
                  />
                </div>
                <div className={styles.w50}>
                  <label htmlFor="last_name">Sobrenome:</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={this.state["formData"].last_name || ""}
                    onChange={(e) => {
                      this.updateFormData(e);
                    }}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.w50}>
                  <label htmlFor="cep">CEP:</label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    value={this.state["formData"].cep || ""}
                    onChange={(e) => {
                      this.updateFormData(e);
                    }}
                    onBlur={(e) => {
                      this.fetchCepInfo(e);
                    }}
                  />
                </div>
                <div className={styles.w50}>
                  <label htmlFor="bairro">Bairro:</label>
                  <input
                    type="text"
                    id="bairro"
                    value={this.state["formData"].bairro || ""}
                    name="bairro"
                    onChange={(e) => {
                      this.updateFormData(e);
                    }}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.w100}>
                  <label htmlFor="logradouro">
                    Logradouro (Rua, Avenida, etc...):
                  </label>
                  <input
                    type="text"
                    id="logradouro"
                    value={this.state["formData"].logradouro || ""}
                    name="logradouro"
                    onChange={(e) => {
                      this.updateFormData(e);
                    }}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.w25}>
                  <label htmlFor="numero">Número:</label>
                  <input
                    type="text"
                    id="numero"
                    value={this.state["formData"].numero || ""}
                    name="numero"
                    onChange={(e) => {
                      this.updateFormData(e);
                    }}
                  />
                </div>

                <div className={styles.w50}>
                  <label htmlFor="cidade">Cidade:</label>
                  <input
                    type="text"
                    id="cidade"
                    value={this.state["formData"].cidade || ""}
                    name="cidade"
                    onChange={(e) => {
                      this.updateFormData(e);
                    }}
                    disabled
                  />
                </div>

                <div className={styles.w25}>
                  <label htmlFor="uf">Estado:</label>
                  <input
                    type="text"
                    id="uf"
                    value={this.state["formData"].uf || ""}
                    name="uf"
                    onChange={(e) => {
                      this.updateFormData(e);
                    }}
                    disabled
                  />
                </div>
              </div>
            </form>

            <div className={styles.buttonHolder}>
              {status ? (
                <a
                  className={styles.button}
                  onClick={(e) => {
                    this.saveChanges(e);
                  }}
                >
                  Salvar
                </a>
              ) : (
                <p className={styles.subTitle}>{msg}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
