import React from 'react';
import {
  Fingerprint,
  Coins,
  GraduationCap,
  History,
  CheckCircle2,
  ChevronRight,
  Calendar,
  ShieldCheck
} from 'lucide-react';

import { useApp } from '../../context/AppContext';

export const ConsentManagement = () => {

  const {
  consents,
  grantConsent,
  consentHistory,
  pendingApplication,
  pendingApplicationMissingConsents,
  setActiveTab
} = useApp();

  const safeConsents = Array.isArray(consents) ? consents : [];
  const safeHistory = Array.isArray(consentHistory) ? consentHistory : [];

  /*
   * If an application is waiting for consent,
   * show only the consents required for that application.
   */
  const requiredConsents =
    Array.isArray(pendingApplicationMissingConsents)
      ? pendingApplicationMissingConsents
      : [];

  const pendingScheme =
    pendingApplication?.serviceName ||
    pendingApplication?.schemeName ||
    null;

  /*
   * Build virtual consent cards for missing consents.
   * These cards do not pretend that consent already exists.
   */
  const requiredConsentCards = requiredConsents.map((req, index) => {

    const department =
      req.department ||
      req.data_provider ||
      req.dataProvider ||
      'Government Department';

    const dataType =
      req.data_type ||
      req.dataType ||
      'Required Data';

    const purpose =
      req.purpose ||
      pendingScheme ||
      'Government Service';

    const existing = safeConsents.find(
      consent =>
        consent.department === department &&
        (
          consent.category === dataType ||
          consent.dataType === dataType
        ) &&
        (
          consent.purpose === purpose ||
          consent.schemeName === purpose
        )
    );

    return {
      id:
        existing?.id ||
        `required-${department}-${dataType}-${purpose}-${index}`,

      name: department,

      purpose:
        `Share ${dataType.toLowerCase()} data for ${purpose}`,

      department,

      category: dataType,

      validTill:
        existing?.validTill || 'Valid till Active',

      enabled:
        existing?.enabled === true
    };
  });

  /*
   * If there is no pending application,
   * display the backend/local consents normally.
   */
  const displayConsents =
    requiredConsentCards.length > 0
      ? requiredConsentCards
      : safeConsents;

  const activeCount = displayConsents.filter(
    consent => consent.enabled
  ).length;

  const getConsentIcon = (name = '') => {

    if (name.toLowerCase().includes('aadhaar')) {
      return (
        <Fingerprint className="w-5 h-5 text-purple-600" />
      );
    }

    if (name.toLowerCase().includes('income')) {
      return (
        <Coins className="w-5 h-5 text-emerald-600" />
      );
    }

    return (
      <GraduationCap className="w-5 h-5 text-blue-600" />
    );
  };

  /*
   * Handle a real consent toggle.
   *
   * Virtual cards need to be matched to the real consent
   * information before sending the grant request.
   */
  const handleConsentClick = async (consent) => {
  // Already granted — do not pretend to revoke it.
  if (consent.enabled) {
    return;
  }

  const requirement = requiredConsents.find((req) => {
    const department =
      req.department ||
      req.data_provider ||
      req.dataProvider;

    const dataType =
      req.data_type ||
      req.dataType ||
      req.category;

    return (
      department === consent.department &&
      dataType === consent.category
    );
  });

  /*
   * If this is a virtual required-consent card,
   * get the actual backend values from the requirement.
   */
  if (requirement) {
    const dataProvider =
      requirement.data_provider ||
      requirement.dataProvider ||
      requirement.department;

    const dataType =
      requirement.data_type ||
      requirement.dataType ||
      requirement.category;

    const purpose =
      requirement.purpose ||
      pendingScheme;

    await grantConsent(
      dataProvider,
      dataType,
      purpose
    );

    return;
  }

  /*
   * Existing backend consent that is currently not granted.
   */
  const dataProvider =
    consent.dataProvider ||
    consent.data_provider ||
    consent.department;

  const dataType =
    consent.dataType ||
    consent.data_type ||
    consent.category;

  const purpose =
    consent.purpose ||
    pendingScheme;

  if (!dataProvider || !dataType || !purpose) {
    console.error(
      'Unable to determine consent details:',
      consent
    );
    return;
  }

  await grantConsent(
    dataProvider,
    dataType,
    purpose
  );
};

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="light-card p-6 rounded-2xl shadow-xs">

        <div className="flex items-start gap-3">

          <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
            <ShieldCheck className="w-6 h-6 text-orange-600" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Consent Management
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Manage your permission to share personal information
              with government departments.
            </p>
          </div>

        </div>
      </div>


      {/* Pending Application Banner */}
      {pendingScheme && requiredConsentCards.length > 0 && (

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">

          <div className="flex items-start gap-3">

            <div className="p-2 rounded-lg bg-white border border-orange-200">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
            </div>

            <div className="flex-1">

              <h2 className="text-sm font-bold text-slate-900">
                Consent required for {pendingScheme}
              </h2>

              <p className="text-xs text-slate-600 mt-1">
                Your application cannot be submitted until you
                explicitly grant the required data-sharing permissions.
              </p>

            </div>

          </div>

        </div>
      )}


      {/* Required Consents */}
      <div className="light-card rounded-2xl p-6 shadow-xs space-y-4">

        <div className="flex items-center justify-between pb-3 border-b border-slate-100">

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {requiredConsentCards.length > 0
                ? 'Required Consents'
                : 'Active Consents'}
            </h2>

            <p className="text-[11px] text-slate-400 mt-1">
              {pendingScheme
                ? `Required permissions for ${pendingScheme}`
                : 'Manage your existing data-sharing permissions'}
            </p>
          </div>

          <span className="text-xs text-slate-400 font-semibold">
            {activeCount}/{displayConsents.length} Active
          </span>

        </div>


        <div className="space-y-3">

          {displayConsents.length === 0 ? (

            <div className="py-10 text-center text-sm text-slate-400">
              No consent records available.
            </div>

          ) : (

            displayConsents.map((consent) => (

              <div
                key={consent.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-orange-50/30"
              >

                <div className="flex items-start sm:items-center gap-3.5">

                  <div className="p-2.5 rounded-xl bg-white text-slate-700 border border-slate-200 shrink-0 shadow-2xs">
                    {getConsentIcon(consent.name)}
                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <h3 className="text-xs font-bold text-slate-900">
                        {consent.name}
                      </h3>

                      {!consent.enabled && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                          REQUIRED
                        </span>
                      )}

                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {consent.purpose}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">

                      <Calendar className="w-3 h-3 text-orange-500" />

                      <span>
                        {consent.validTill || 'Valid till Active'}
                      </span>

                      <span className="text-slate-300">
                        •
                      </span>

                      <span className="text-slate-600">
                        {consent.department}
                      </span>

                    </div>

                  </div>

                </div>


                {/* Toggle */}
                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">

                  <span
                    className={`text-[11px] font-bold ${
                      consent.enabled
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {consent.enabled
                      ? 'Active'
                      : 'Not Granted'}
                  </span>

                  <button
                     type="button"
                      onClick={() => handleConsentClick(consent)}
                      disabled={consent.enabled}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      consent.enabled
                        ? 'bg-emerald-500'
                        : 'bg-slate-300'
                    }`}
                    aria-label={`Toggle consent for ${consent.name}`}
                  >

                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                        consent.enabled
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />

                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>


      {/* Continue Application */}
      {pendingScheme && requiredConsentCards.length > 0 && (

        <div className="light-card rounded-2xl p-5 border border-slate-200">

          <div className="flex items-center justify-between gap-4">

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Waiting for consent
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Grant all required permissions to continue
                your application.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('apply')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
            >
              Back to Application
            </button>

          </div>

        </div>

      )}


      {/* History */}
      <div className="light-card rounded-2xl p-6 shadow-xs space-y-4">

        <div className="flex items-center justify-between pb-3 border-b border-slate-100">

          <div className="flex items-center gap-2">

            <History className="w-4 h-4 text-orange-500" />

            <h2 className="text-sm font-bold text-slate-900">
              Consent History & Audit Log
            </h2>

          </div>

          <span className="text-xs text-orange-600 font-bold flex items-center gap-1">
            <span>Audit Trail</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left text-xs">

            <thead>

              <tr className="border-b border-slate-100 text-slate-400 font-semibold">

                <th className="pb-3 px-2 font-bold">
                  Action
                </th>

                <th className="pb-3 px-2 font-bold">
                  Department / Agency
                </th>

                <th className="pb-3 px-2 font-bold">
                  Date & Time
                </th>

                <th className="pb-3 px-2 font-bold">
                  Status
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {safeHistory.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="py-8 text-center text-slate-400"
                  >
                    No consent history available.
                  </td>

                </tr>

              ) : (

                safeHistory.map((item) => (

                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >

                    <td className="py-3 px-2 font-semibold text-slate-800">
                      {item.action}
                    </td>

                    <td className="py-3 px-2 text-slate-600">
                      {item.department}
                    </td>

                    <td className="py-3 px-2 text-slate-400">
                      {item.date}
                    </td>

                    <td className="py-3 px-2">

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">

                        <CheckCircle2 className="w-3 h-3" />

                        {item.status}

                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default ConsentManagement;