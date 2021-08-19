import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'FormPnPWebPartStrings';
import FormPnP from './components/FormPnP';
import { IFormPnPProps } from './components/IFormPnPProps';

import { sp } from '@pnp/sp';

export interface IFormPnPWebPartProps {
  description: string;
  context: any;
  requestClient: any;
}

export default class FormPnPWebPart extends BaseClientSideWebPart<IFormPnPWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFormPnPProps> = React.createElement(
      FormPnP,
      {
        description: this.properties.description,
        context: this.context,
        requestClient: this.context.httpClient 
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {

    return super.onInit().then(_ => {
  
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
