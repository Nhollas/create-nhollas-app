import { http, HttpResponse } from "msw"

export const clerkHandlers = [
  http.get("https://api.clerk.dev/v1/users/*", () => {
    const user = {
      id: "user_123",
      object: "user",
      username: null,
      first_name: null,
      last_name: null,
      image_url:
        "https://i1.sndcdn.com/artworks-XJdVplPCbvDvJlH7-jF9c4A-t500x500.jpg",
      has_image: false,
      primary_email_address_id: "idn_123",
      primary_phone_number_id: null,
      primary_web3_wallet_id: null,
      password_enabled: true,
      two_factor_enabled: false,
      totp_enabled: false,
      backup_code_enabled: false,
      email_addresses: [
        {
          id: "idn_123",
          object: "email_address",
          email_address: "test@test.com",
          reserved: false,
          verification: {
            status: "verified",
            strategy: "email_code",
            attempts: 1,
            expire_at: 1712083047595,
          },
          linked_to: [],
          created_at: 1712082447007,
          updated_at: 1712082981494,
        },
      ],
      phone_numbers: [],
      web3_wallets: [],
      passkeys: [],
      external_accounts: [],
      saml_accounts: [],
      public_metadata: {},
      private_metadata: {},
      unsafe_metadata: {},
      external_id: null,
      last_sign_in_at: 1712599899975,
      banned: false,
      locked: false,
      lockout_expires_in_seconds: null,
      verification_attempts_remaining: 100,
      created_at: 1712082981450,
      updated_at: 1712599900005,
      delete_self_enabled: true,
      create_organization_enabled: true,
      last_active_at: 1712577311928,
      profile_image_url: "https://www.gravatar.com/avatar?d=mp",
    }
    return HttpResponse.json(user)
  }),
]
