function verification(link) {
  return `
      <table border="0" cellpadding="0" cellspacing="0" style="margin:0; padding:0">
        <tr>
          <td><b>You have successfully signed up for Morze!</b></td>
        </tr>
        <tr>
          <td>Follow the link to verify your account and finish registration:</td>
        </tr>
        <tr>
          <td><a 
          href=${link} 
          style="color: #333333; font: 14px Arial, sans-serif; line-height: 30px; -webkit-text-size-adjust:none; display: block;" target="_blank"
          >${link}</a>
          </td>
        </tr>
      </table>
    `;
}

module.exports = {
  verification
};