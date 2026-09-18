import React from 'react';

import {
  Fingerprint,
  Coins,
  GraduationCap,
  History,
  CheckCircle2,
  ChevronRight,
  Calendar,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';


export const ConsentManagement = () => {

  const {
    consents,
    handleToggleConsent,
    consentHistory,
    pendingApplication,
  } = useApp();


  // =========================================================
  // SAFE CONSENT ICON
  // =========================================================

  const getConsentIcon = (name) => {

    const safeName =
      String(name || '');


    if (
      safeName
        .toLowerCase()
        .includes('income')
    ) {

      return (
        <Coins className="w-5 h-5 text-emerald-600" />
      );

    }


    if (
      safeName
        .toLowerCase()
        .includes('aadhaar')
    ) {

      return (
        <Fingerprint className="w-5 h-5 text-purple-600" />
      );

    }


    return (
      <GraduationCap className="w-5 h-5 text-blue-600" />
    );

  };


  // =========================================================
  // SAFE DATA
  // =========================================================

  const safeConsents =
    Array.isArray(consents)
      ? consents
      : [];


  const safeConsentHistory =
    Array.isArray(consentHistory)
      ? consentHistory
      : [];


  const activeConsentCount =
    safeConsents.filter(
      (consent) =>
        consent?.enabled
    ).length;


  const requiredConsentCount =
    safeConsents.length;


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="space-y-6 pb-12">


      {/* =====================================================
          TITLE
      ===================================================== */}

      <div className="light-card p-6 rounded-2xl shadow-xs">

        <div className="flex items-center gap-2 mb-2">

          <Fingerprint className="w-5 h-5 text-orange-500" />

          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">

            Data Sharing & Privacy

          </span>

        </div>


        <h1 className="text-xl font-bold text-slate-900">

          Consent Management

        </h1>


        <p className="text-xs text-slate-500 mt-1">

          Manage your consent to share data with government
          departments for faster and smoother services.

        </p>

      </div>


      {/* =====================================================
          PENDING APPLICATION NOTICE
      ===================================================== */}

      {pendingApplication && (

        <div
          className="
            rounded-2xl
            border
            border-orange-200
            bg-orange-50
            p-5
          "
        >

          <div className="flex items-start gap-3">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-orange-100
                flex
                items-center
                justify-center
                shrink-0
              "
            >

              <CheckCircle2
                className="w-5 h-5 text-orange-600"
              />

            </div>


            <div>

              <h3 className="text-sm font-bold text-orange-900">

                Application waiting for consent

              </h3>


              <p className="text-xs text-orange-700 mt-1">

                Your{' '}

                <span className="font-bold">

                  {pendingApplication.schemeName}

                </span>{' '}

                application will be submitted automatically
                after all required consents are granted.

              </p>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          ACTIVE CONSENTS
      ===================================================== */}

      <div className="light-card rounded-2xl p-6 shadow-xs space-y-4">


        <div
          className="
            flex
            items-center
            justify-between
            pb-3
            border-b
            border-slate-100
          "
        >

          <div>

            <h2 className="text-sm font-bold text-slate-900">

              Required Consents

            </h2>


            <p className="text-[11px] text-slate-400 mt-0.5">

              Required departments for Education Scholarship.

            </p>

          </div>


          <span
            className="
              text-xs
              text-slate-400
              font-semibold
            "
          >

            {activeConsentCount}/{requiredConsentCount} Active

          </span>

        </div>


        {/* ===================================================
            CONSENT LIST
        =================================================== */}

        <div className="space-y-3">


          {safeConsents.map(
            (
              consent,
              index
            ) => {

              if (!consent) {
                return null;
              }


              const consentId =
                consent.id ||
                consent.consent_id ||
                `consent-${index}`;


              const consentName =
                consent.name ||
                consent.dataProvider ||
                consent.data_provider ||
                consent.department ||
                'Government Department';


              const consentPurpose =
                consent.purpose ||
                'Education Scholarship';


              const department =
                consent.department ||
                consent.dataProvider ||
                consent.data_provider ||
                'Government Department';


              const dataType =
                consent.dataType ||
                consent.data_type ||
                consent.category ||
                'General';


              const validTill =
                consent.validTill ||
                consent.valid_till ||
                'Active';


              const enabled =
                Boolean(
                  consent.enabled
                );


              return (

                <div
                  key={consentId}
                  className="
                    p-4
                    rounded-xl
                    bg-slate-50
                    border
                    border-slate-200/80
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    justify-between
                    gap-4
                    transition-all
                    hover:bg-orange-50/30
                  "
                >


                  {/* =================================================
                      INFORMATION
                  ================================================= */}

                  <div
                    className="
                      flex
                      items-start
                      sm:items-center
                      gap-3.5
                    "
                  >


                    {/* ICON */}

                    <div
                      className="
                        p-2.5
                        rounded-xl
                        bg-white
                        text-slate-700
                        border
                        border-slate-200
                        shrink-0
                        shadow-2xs
                      "
                    >

                      {getConsentIcon(
                        consentName
                      )}

                    </div>


                    {/* TEXT */}

                    <div>

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <h3
                          className="
                            text-xs
                            font-bold
                            text-slate-900
                          "
                        >

                          {consentName}

                        </h3>


                        <span
                          className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-wide
                            px-1.5
                            py-0.5
                            rounded-full
                            bg-orange-100
                            text-orange-700
                          "
                        >

                          Required

                        </span>

                      </div>


                      <p
                        className="
                          text-[11px]
                          text-slate-500
                          mt-0.5
                        "
                      >

                        Share{' '}

                        <span className="font-semibold">

                          {dataType}

                        </span>{' '}

                        data for{' '}

                        <span className="font-semibold">

                          {consentPurpose}

                        </span>

                      </p>


                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                          mt-1.5
                          text-[10px]
                          text-slate-400
                          font-medium
                        "
                      >

                        <Calendar
                          className="
                            w-3
                            h-3
                            text-orange-500
                          "
                        />


                        <span>

                          Valid till {validTill}

                        </span>


                        <span className="text-slate-300">

                          •

                        </span>


                        <span className="text-slate-600">

                          {department}

                        </span>

                      </div>

                    </div>

                  </div>


                  {/* =================================================
                      TOGGLE
                  ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleConsent(
                        consentId
                      )
                    }
                    className={`
                      relative
                      w-12
                      h-6
                      rounded-full
                      transition-all
                      shrink-0
                      ${
                        enabled
                          ? 'bg-emerald-500'
                          : 'bg-slate-300'
                      }
                    `}
                    aria-label={
                      enabled
                        ? `Disable ${consentName}`
                        : `Enable ${consentName}`
                    }
                  >

                    <span
                      className={`
                        absolute
                        top-1
                        w-4
                        h-4
                        bg-white
                        rounded-full
                        shadow-sm
                        transition-all
                        ${
                          enabled
                            ? 'left-7'
                            : 'left-1'
                        }
                      `}
                    />

                  </button>

                </div>

              );

            }
          )}

        </div>

      </div>


      {/* =====================================================
          PRIVACY INFORMATION
      ===================================================== */}

      <div
        className="
          light-card
          rounded-2xl
          p-6
          shadow-xs
          border
          border-blue-100
          bg-blue-50/30
        "
      >

        <div className="flex items-start gap-3">

          <div
            className="
              p-2
              rounded-xl
              bg-blue-100
              shrink-0
            "
          >

            <Fingerprint
              className="w-5 h-5 text-blue-600"
            />

          </div>


          <div>

            <h3
              className="
                text-sm
                font-bold
                text-slate-900
              "
            >

              Your data, your control

            </h3>


            <p
              className="
                text-xs
                text-slate-500
                mt-1
                leading-relaxed
              "
            >

              Government departments can access your
              information only when the required consent
              has been granted. You can manage your consent
              preferences here.

            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          CONSENT HISTORY
      ===================================================== */}

      <div
        className="
          light-card
          rounded-2xl
          p-6
          shadow-xs
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            pb-3
            border-b
            border-slate-100
          "
        >

          <History
            className="w-4 h-4 text-slate-500"
          />


          <div>

            <h2
              className="
                text-sm
                font-bold
                text-slate-900
              "
            >

              Consent History

            </h2>


            <p
              className="
                text-[11px]
                text-slate-400
              "
            >

              Previous consent actions

            </p>

          </div>

        </div>


        {/* ===================================================
            NO HISTORY
        =================================================== */}

        {safeConsentHistory.length === 0 && (

          <div className="py-6 text-center">

            <History
              className="
                w-7
                h-7
                text-slate-300
                mx-auto
                mb-2
              "
            />


            <p
              className="
                text-xs
                font-semibold
                text-slate-500
              "
            >

              No consent history available

            </p>

          </div>

        )}


        {/* ===================================================
            HISTORY LIST
        =================================================== */}

        {safeConsentHistory.length > 0 && (

          <div className="mt-4 space-y-3">

            {safeConsentHistory.map(
              (
                item,
                index
              ) => {

                if (!item) {
                  return null;
                }


                const historyName =
                  item.name ||
                  item.dataProvider ||
                  item.data_provider ||
                  item.department ||
                  'Government Department';


                const historyStatus =
                  item.status ||
                  item.action ||
                  'Updated';


                const historyDate =
                  item.date ||
                  item.createdAt ||
                  item.created_at ||
                  'Recently';


                const isGranted =
                  String(
                    historyStatus
                  )
                    .toLowerCase()
                    .includes('grant') ||
                  String(
                    historyStatus
                  )
                    .toLowerCase()
                    .includes('approv') ||
                  String(
                    historyStatus
                  )
                    .toLowerCase()
                    .includes('active');


                return (

                  <div
                    key={
                      item.id ||
                      item.history_id ||
                      `history-${index}`
                    }
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      p-3
                      rounded-xl
                      bg-slate-50
                      border
                      border-slate-100
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className={`
                          p-2
                          rounded-lg
                          ${
                            isGranted
                              ? 'bg-emerald-100'
                              : 'bg-slate-100'
                          }
                        `}
                      >

                        <CheckCircle2
                          className={`
                            w-4
                            h-4
                            ${
                              isGranted
                                ? 'text-emerald-600'
                                : 'text-slate-400'
                            }
                          `}
                        />

                      </div>


                      <div>

                        <p
                          className="
                            text-xs
                            font-bold
                            text-slate-800
                          "
                        >

                          {historyName}

                        </p>


                        <p
                          className="
                            text-[10px]
                            text-slate-400
                            mt-0.5
                          "
                        >

                          {historyStatus}

                        </p>

                      </div>

                    </div>


                    <span
                      className="
                        text-[10px]
                        text-slate-400
                      "
                    >

                      {historyDate}

                    </span>

                  </div>

                );

              }
            )}

          </div>

        )}

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-center
          gap-1.5
          text-[10px]
          text-slate-400
        "
      >

        <span>

          Consent changes are synchronized with GovSync.

        </span>


        <ChevronRight
          className="w-3 h-3"
        />


        <span>

          Secure data exchange

        </span>

      </div>

    </div>

  );

};


export default ConsentManagement;