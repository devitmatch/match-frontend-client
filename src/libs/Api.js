/* eslint-disable no-console */
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

class Api {
  constructor() {
    this.authURL = process.env.REACT_APP_API_AUTH_URL;

    axios.defaults.timeout = 3600000;
    axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

    const accessToken = localStorage.getItem('leatkn');
    if (accessToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
    createAuthRefreshInterceptor(axios, this.refreshAuth);
  }

  auth = async (email, password) => {
    return axios({
      method: 'post',
      url: this.authURL,
      data: `grant_type=password&username=${email}&password=${password}&client_id=${process.env.REACT_APP_API_CLIENT_KEY}&client_secret=${process.env.REACT_APP_API_CLIENT_SECRET}`,
    })
      .then((res) => {
        localStorage.setItem('leatkn', res.data.access_token);
        localStorage.setItem('lertkn', res.data.refresh_token);
        axios.defaults.headers.Authorization = `Bearer ${res.data.access_token}`;
        return res;
      })
      .catch(() => {
        return false;
      });
  };

  refreshAuth = (failedRequest) => {
    const refreshToken = localStorage.getItem('lertkn');
    if (refreshToken) {
      return axios({
        method: 'post',
        url: this.authURL,
        data: `grant_type=refresh_token&client_id=${process.env.REACT_APP_API_CLIENT_KEY}&client_secret=${process.env.REACT_APP_API_CLIENT_SECRET}&refresh_token=${refreshToken}`,
      })
        .then((res) => {
          localStorage.setItem('leatkn', res.data.access_token);
          localStorage.setItem('lertkn', res.data.refresh_token);
          // eslint-disable-next-line no-param-reassign
          failedRequest.response.config.headers.Authorization = `Bearer ${res.data.access_token}`;
          return Promise.resolve();
        })
        .catch(() => {
          localStorage.clear('leatkn');
          localStorage.clear('lertkn');
          window.location.href = '/';
        });
    }
    return false;
  };

  clientRegister = async (password) => {
    return axios
      .get(`/client_register/?token=${password}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return false;
      });
  };

  getUser = () => {
    return axios
      .get('/user/')
      .then((res) => {
        return res.data[0];
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  getResetPassword = (email) => {
    return axios
      .get(`/reset_password/?email=${email}&client=true`)
      .then((res) => {
        return res;
      })
      .catch(() => {
        throw new Error('Failed to get reset password');
      });
  };

  postResetPassword = (data) => {
    return axios
      .post('/update_password/', data)
      .then((res) => {
        return res;
      })
      .catch(() => {
        throw new Error('Failed to reset password');
      });
  };

  getCountries = () => {
    return axios
      .get(`/country/`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get countries');
      });
  };

  getRegions = () => {
    return axios
      .get(`/region/`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get regions');
      });
  };

  createClientAccount = (data, token) => {
    return axios
      .post(`/client_register/?token=${token}`, data)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get regions');
      });
  };

  getBriefings = (filter) => {
    return axios
      .get(`/briefing/${filter || ''}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  createVisualReference = (formData) => {
    return axios
      .post('/visual_reference/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  createBriefing = (data) => {
    return axios
      .post('/briefing/', data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  getBriefing = (id) => {
    return axios
      .get(`/briefing/${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  updateBriefing = (id, data) => {
    return axios
      .patch(`/briefing/${id}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        throw new Error('Failed to update Briefing');
      });
  };

  getLibrary = (filters, config) => {
    return axios
      .get(`/library/${filters}`, { ...config })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  getAttendances = (filters) => {
    return axios
      .get(`/meeting_box/?${filters}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get the attendances');
      });
  };

  getAttendance = (attendanceId) => {
    return axios
      .get(`/meeting_box/${attendanceId}/`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get attendance');
      });
  };

  getPresentation = (presentationId) => {
    return axios
      .get(`/meeting/${presentationId}/`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get presentation');
      });
  };

  getPresentationSelectedPrints = (presentation) => {
    return axios
      .get(`/selected_print/?meeting=${presentation}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get presentation selected prints');
      });
  };

  getFavoritePresentationSelectedPrints = (clientId, meeting) => {
    return axios
      .get(`/favorite_selected_prints/?client=${clientId}&meeting=${meeting}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get favorite selected prints');
      });
  };

  favoritePrint = (selectedPrint, meeting) => {
    return axios
      .post('/favorite/', {
        selected_print: selectedPrint,
        meeting,
      })
      .then((res) => res.data)
      .catch(() => {
        throw new Error('Failed to favorite print');
      });
  };

  removeFavoritePrint = (printId, meetingId) => {
    return axios
      .get(`/remove_favorite/?selected_print=${printId}&meeting=${meetingId}`)
      .then((res) => res.data)
      .catch(() => {
        throw new Error('Failed to remove favorite print');
      });
  };

  getDollsByProfile = (profiles) => {
    return axios
      .get(`/dolly/?customer_profile=${profiles}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get dolls profiles');
      });
  };

  getDollyMasks = (dollId) => {
    return axios
      .get(`/dolly_mask/?dolly=${dollId}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get dolls masks');
      });
  };

  getMainDollyAdjustment = (printId, dollId) => {
    return axios
      .get(`/main_dolly_adjustment/?print=${printId}&dolly=${dollId}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get main dolls adjustment');
      });
  };

  getDollyAdjustment = (printId, dollId) => {
    return axios
      .get(`/dolly_adjustment/?print=${printId}&dolly=${dollId}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get dolls adjustment');
      });
  };

  getConcept = (presentationId) => {
    return axios
      .get(`/concept/?attendance=${presentationId}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get presentation concepts');
      });
  };

  getExclusiveMeetingPrints = (
    meeting,
    regsQuery,
    countriesQuery,
    clientId
  ) => {
    return axios
      .get(
        `/selected_print/?meeting=${meeting}${
          regsQuery && regsQuery.length ? `&regs=${regsQuery}` : ''
        }${
          countriesQuery && countriesQuery.length
            ? `&countries=${countriesQuery}`
            : ''
        }${clientId ? `&client=${clientId}` : ''}`
      )
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get exclusive selected prints');
      });
  };

  getClient = () => {
    return axios
      .get('/client/')
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  getClientById = (clientId) => {
    return axios
      .get(`/client/${clientId}`)
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);

        return false;
      });
  };

  updateClient = (clientId, data) => {
    return axios
      .patch(`/client/${clientId}/`, data)
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);

        throw new Error('Failed to update Client');
      });
  };

  getTags = () => {
    return axios
      .get('/tag')
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  getFabrics = () => {
    return axios
      .get(`/fabric/`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get fabrics');
      });
  };

  getFabricImages = (id) => {
    return axios
      .get(`/fabric_image/?fabric=${id}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get fabric images');
      });
  };

  createProduct = (data) => {
    return axios
      .post(`/product/`, data)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to create the product');
      });
  };

  createOrder = (data) => {
    return axios
      .post('/order/', data)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to create order');
      });
  };

  sendOrderEmail = (orderId) => {
    return axios
      .get(`/send_order_email/?order_id=${orderId}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to send order email');
      });
  };

  createProductOrder = (data) => {
    return axios
      .post('/product_order/', data)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to add the product order');
      });
  };

  getLastAttendance = () => {
    return axios
      .get('/meeting_box/?last=true')
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get last attendance');
      });
  };

  getLastOrders = () => {
    return axios
      .get('/order/?status=APP,PROD,DISP,OPEN&last_three=true')
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get last orders');
      });
  };

  getLastOrder = () => {
    return axios
      .get('/order/?last=true')
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get last orders');
      });
  };

  getPrintsExclusivities = (printIds) => {
    return axios
      .get(`/exclusivity_print/?print_id=${printIds}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get exclusivities');
      });
  };

  getPrint = (id) => {
    return axios
      .get(`/print/${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  createPrint = (formData, progressConfig) => {
    return axios
      .post('/print/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...progressConfig,
      })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to create Print');
      });
  };

  createCustomization = (data) => {
    return axios
      .post('/customization/', data)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to save customization');
      });
  };

  addDollyAdjustment = (data) => {
    return axios
      .post('/dolly_adjustment/', data)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to add doll adjustment');
      });
  };

  updateDollyAdjustment = (adjustmentId, data) => {
    return axios
      .patch(`/dolly_adjustment/${adjustmentId}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to update doll adjustment');
      });
  };

  addMainDollyAdjustment = (data) => {
    return axios
      .post('/main_dolly_adjustment/', data)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to add main doll adjustment');
      });
  };

  updateMainDollyAdjustment = (adjustmentId, data) => {
    return axios
      .patch(`/main_dolly_adjustment/${adjustmentId}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to update main doll adjustment');
      });
  };

  getCountries = () => {
    return axios
      .get(`/country/`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get countries');
      });
  };

  getRegions = () => {
    return axios
      .get(`/region/`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get regions');
      });
  };

  getOtherIdeas = (meetingId) => {
    return axios
      .get(`/idea/?meeting=${meetingId}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get ideas');
      });
  };

  getRegion = () => {
    return axios
      .get('/region/')
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  getCountries = () => {
    return axios
      .get(`/country/`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get countries');
      });
  };

  getClientOrders = (filters) => {
    return axios
      .get(`/order/${filters ? `?${filters}` : ''}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get orders');
      });
  };

  getClientOrder = (orderId) => {
    return axios
      .get(`/order/${orderId}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get order');
      });
  };

  getExclusivity = (printId) => {
    return axios
      .get(`/exclusivity_print/?print_id=${printId}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to create exclusivity');
      });
  };

  getMiniPrint = (id) => {
    return axios
      .get(`/mini_print/?print_id=${id}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  getManualApplication = (printId) => {
    return axios
      .get(`/manual_application/?print_id=${printId}`)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get manual application');
      });
  };

  getNotifications = () => {
    return axios
      .get('/notification/')
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err, 'Failed to get notifications');
      });
  };

  viewAllNotifications = (notification) => {
    return axios
      .patch(`/notification/${notification.id}/`, { view_all: true })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to view all feedback');
      });
  };

  getChat = () => {
    return axios
      .get('/chat/')
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get chat');
      });
  };

  sendMessage = (text, client) => {
    return axios
      .post('/chat/', {
        sent_by_client: true,
        text,
        client,
      })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get chat');
      });
  };

  readMessage = (messageId, data) => {
    return axios
      .patch(`/chat/${messageId}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to read feedback');
      });
  };

  getCoverImages = () => {
    return axios
      .get('/client_cover/')
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to get cover images');
      });
  };

  addMainDollyAdjustment = (data) => {
    return axios
      .post('/main_dolly_adjustment/', data)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to add main doll adjustment');
      });
  };

  updateMainDollyAdjustment = (adjustmentId, data) => {
    return axios
      .patch(`/main_dolly_adjustment/${adjustmentId}/`, data)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        throw new Error('Failed to update main doll adjustment');
      });
  };
}

export default new Api();
