export interface YapilyAccountAuthRequestResponse {
  data: {
    authorisationUrl: string;
  };
}

export interface YapilyAccount {
  id: string;
  type: string;
  balance: number;
  currency: string;
  usageType: string;
  accountType: string;
  accountNames: { name: string }[];
  accountIdentifications: { type: string; identification: string }[];
  accountBalances: {
    type: string;
    dateTime: string;
    balanceAmount: {
      amount: number;
      currency: string;
    };
    creditLineIncluded: boolean;
    creditLines: {
      type: string;
      creditLineAmount: {
        amount: number;
        currency: string;
      };
    }[];
  }[];
}

interface YapilySuccessResponse {
  data: YapilyAccount[];
}

export interface YapilyErrorResponse {
  message: string;
  status?: number;
  data?: any;
}

export type YapilyApiResponse = YapilySuccessResponse | YapilyErrorResponse;

export interface YapilyTransaction {
  id: string;
  date: string;
  bookingDateTime: string;
  valueDateTime: string;
  status: string;
  amount: number;
  currency: string;
  transactionAmount: {
    amount: number;
    currency: string;
  };
  reference: string;
  description: string;
  transactionInformation: string[];
  isoBankTransactionCode: {
    code: string;
    subCode: string;
  };
  proprietaryBankTransactionCode: string;
  balance: {
    type: string;
    balanceAmount: {
      amount: number;
      currency: string;
    };
  };
  payeeDetails: {
    name: string;
    accountIdentifications: {
      type: string;
      identification: string;
    }[];
  };
  payerDetails: {
    name: string;
    accountIdentifications: {
      type: string;
      identification: string;
    }[];
  };
  enrichment: {
    transactionHash: {
      hash: string;
    };
  };
}

export type YapilyTransactionApiResponse =
  | { message?: string; data?: YapilyTransaction[]; status?: number }
  | YapilyTransaction[];
